import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { address_zero, lpAddress } from "../constants";
import { getLpPriceParams } from "../store/lpPrice";
import {
  getLpTotalSupplyAmountParams,
  setLpTotalSupplyAmount,
} from "../store/lpTotalSupplyAmount";

export async function tvlTransferLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();
    const block = ctx.substrate.block.height;
    const txHash = ctx.txHash;

    const itemLp = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = itemLp.lpSymbol.toLowerCase();
    const quoteToken = itemLp.quoteToken;

    const mint = pair.events["Transfer(address,address,uint256)"].decode(ctx);
    const { from, to, value: _value } = mint;
    const fromAddress = from.toLowerCase();
    const toAddress = to.toLowerCase();
    const value = Number(_value) / Math.pow(10, 18);
    let lpTotalSupplyAmountParams = await getLpTotalSupplyAmountParams({
      ctx,
      value: `${value.toFixed(18)}`,
      lpAddress: pairAddress,
      block,
      txHash,
      fromAddress: fromAddress,
      toAddress: toAddress,
    });
    let lpPriceParams = await getLpPriceParams({
      ctx,
      lpAddress: pairAddress,
      lpSymbol: lp_symbol,
      block,
      txHash,
    });

    let len = lpTotalSupplyAmountParams.idInt;
    let lpTotalSupply = Number(lpTotalSupplyAmountParams.totalSupply);
    let event = "";

    if (fromAddress === address_zero) {
      lpTotalSupply = lpTotalSupply + value;
      lpTotalSupplyAmountParams.totalSupply = `${lpTotalSupply.toFixed(18)}`;

      if (event === "TransferBurn") {
        len = len + 1;
        lpTotalSupplyAmountParams.idInt = len;
        lpTotalSupplyAmountParams.id = `${len}`;
        lpPriceParams.idInt = len;
        lpPriceParams.id = `${len}`;
      }
      event = "TransferMint";
      lpPriceParams.event = "TransferMint";
      lpTotalSupplyAmountParams.event = event;
      await setLpTotalSupplyAmount(ctx, lpTotalSupplyAmountParams);
    }
    if (toAddress === address_zero && from.toLowerCase() === pairAddress) {
      lpTotalSupply = lpTotalSupply - value;
      lpTotalSupplyAmountParams.totalSupply = `${lpTotalSupply.toFixed(18)}`;
      if (event === "TransferMint") {
        len = len + 1;
        lpTotalSupplyAmountParams.idInt = len;
        lpTotalSupplyAmountParams.id = `${len}`;
        lpPriceParams.idInt = len;
        lpPriceParams.id = `${len}`;
      }
      event = "TransferBurn";
      lpPriceParams.event = "TransferBurn";
      lpTotalSupplyAmountParams.event = event;
      await setLpTotalSupplyAmount(ctx, lpTotalSupplyAmountParams);
    }
  } catch (e) {
    console.log("Transfer Error: ", e, ctx.txHash);
  }
}
