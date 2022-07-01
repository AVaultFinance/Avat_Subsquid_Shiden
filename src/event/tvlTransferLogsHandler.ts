import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { address_zero, lpAddress, stable_symbol } from "../constants";
import { calcLpPrice, getLpPriceParams, setLpPrice } from "../store/lpPrice";
import { getLpTokenAmount } from "../store/lpTokenAmount";
import {
  getLpTotalSupplyAmountParams,
  setLpTotalSupplyAmount,
} from "../store/lpTotalSupplyAmount";
import {
  calcTokenPrice,
  getTokenPriceParams,
  setTokenPrice,
} from "../store/tokenPrice";

export async function tvlTransferLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();
    const block = ctx.substrate.block.height;
    const txHash = ctx.txHash;

    const itemLp = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = itemLp.lpSymbol;
    const [token, quoteToken] = lp_symbol.split(" ")[0].split("-");

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
      lpPriceSymbol: quoteToken,
      block,
      txHash,
    });
    const quoteTokenAmount = await getLpTokenAmount({ ctx });

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
        lpPriceParams.idInt = lpPriceParams.idInt + 1;
        lpPriceParams.id = `${lpPriceParams.idInt}`;
      }
      event = "TransferMint";
      lpPriceParams.event = "TransferMint";
      lpTotalSupplyAmountParams.event = event;
      await setLpTotalSupplyAmount(ctx, lpTotalSupplyAmountParams);
      // ------lpPrice------
      const lpPrice = calcLpPrice({
        totalSupply: lpTotalSupplyAmountParams.totalSupply,
        quoteTokenAmount: quoteTokenAmount.quoteTokenAmount,
      });
      lpPriceParams.lpPrice = lpPrice;
      await setLpPrice(ctx, lpPriceParams);
      // ------tokenPrice------
      if (quoteToken === stable_symbol) {
        const tokenPriceParams = await getTokenPriceParams({
          ctx,
          block,
          txHash,
        });
        tokenPriceParams.tokenPrice = calcTokenPrice({
          lpPrice: lpPrice,
          tokenAmount: quoteTokenAmount.tokenAmount,
          totalSupply: lpTotalSupplyAmountParams.totalSupply,
        });
        tokenPriceParams.event = "TransferMint";
        await setTokenPrice(ctx, tokenPriceParams);
      }
    }
    if (toAddress === address_zero && from.toLowerCase() === pairAddress) {
      lpTotalSupply = lpTotalSupply - value;
      lpTotalSupplyAmountParams.totalSupply = `${lpTotalSupply.toFixed(18)}`;
      if (event === "TransferMint") {
        len = len + 1;
        lpTotalSupplyAmountParams.idInt = len;
        lpTotalSupplyAmountParams.id = `${len}`;
        lpPriceParams.idInt = lpPriceParams.idInt + 1;
        lpPriceParams.id = `${lpPriceParams.idInt}`;
      }
      event = "TransferBurn";
      lpPriceParams.event = "TransferBurn";
      lpTotalSupplyAmountParams.event = event;
      await setLpTotalSupplyAmount(ctx, lpTotalSupplyAmountParams);
      const lpPrice = calcLpPrice({
        totalSupply: lpTotalSupplyAmountParams.totalSupply,
        quoteTokenAmount: quoteTokenAmount.quoteTokenAmount,
      });
      lpPriceParams.lpPrice = lpPrice;
      await setLpPrice(ctx, lpPriceParams);
      // ------tokenPrice------
      if (quoteToken === stable_symbol) {
        const tokenPriceParams = await getTokenPriceParams({
          ctx,
          block,
          txHash,
        });
        tokenPriceParams.tokenPrice = calcTokenPrice({
          lpPrice: lpPrice,
          tokenAmount: quoteTokenAmount.tokenAmount,
          totalSupply: lpTotalSupplyAmountParams.totalSupply,
        });
        tokenPriceParams.event = "TransferBurn";
        await setTokenPrice(ctx, tokenPriceParams);
      }
    }
  } catch (e) {
    console.log("Transfer Error: ", e, ctx.txHash);
  }
}
