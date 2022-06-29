import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { address_zero, lpAddress } from "../constants";
import { LpTokenAmount } from "../model";
import { LpTotalSupplyAmount } from "../model/generated/lpTotalSupplyAmount.model";
import { setLpTotalSupplyAmount } from "../utils/setTVLChart";
import { getDecimal, sleep } from "../utils/utils";

export async function tvlTransferLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();
    const mint = pair.events["Transfer(address,address,uint256)"].decode(ctx);
    const { from, to, value: _value } = mint;
    const value = Number(_value) / Math.pow(10, 18);
    const lpTotalSupplyAmount = ctx.store.getRepository(LpTotalSupplyAmount);
    const lpTotalSupplyAmountLength = await lpTotalSupplyAmount.count();

    const blcok = ctx.substrate.block.height;

    let lpTotalSupply = 0;
    let event = "";
    if (lpTotalSupplyAmountLength) {
      const lastLpTotalSupply = await lpTotalSupplyAmount.find({
        idInt: lpTotalSupplyAmountLength - 1,
      });
      lpTotalSupply = Number(lastLpTotalSupply[0].totalSupply);
    }

    let len = lpTotalSupplyAmountLength;
    if (from.toLowerCase() === address_zero) {
      lpTotalSupply = lpTotalSupply + value;
      if (event === "Burn") {
        len = len + 1;
      }
      event = "Mint";
      await setLpTotalSupplyAmount(ctx, {
        id: `${len}`,
        idInt: len,
        totalSupply: `${lpTotalSupply}`,
        value: `${value}`,
        block: blcok,
        txHash: ctx.txHash,
        lpAddress: pairAddress,
        fromAddress: from.toLowerCase(),
        toAddress: to.toLowerCase(),
        event: event,
      });
    }
    if (
      to.toLowerCase() === address_zero &&
      from.toLowerCase() === pairAddress
    ) {
      lpTotalSupply = lpTotalSupply - value;
      if (event === "Mint") {
        len = len + 1;
      }
      event = "Burn";

      await setLpTotalSupplyAmount(ctx, {
        id: `${len}`,
        idInt: len,
        totalSupply: `${lpTotalSupply}`,
        value: `${value}`,
        block: blcok,
        txHash: ctx.txHash,
        lpAddress: pairAddress,
        fromAddress: from.toLowerCase(),
        toAddress: to.toLowerCase(),
        event: event,
      });
    }
  } catch (e) {
    console.log("Transfer Error: ", e, ctx.txHash);
  }
}
