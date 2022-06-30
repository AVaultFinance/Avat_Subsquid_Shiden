import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress } from "../constants";
import { LpTokenAmount } from "../model/generated/lpTokenAmount.model";
import { setLpTokenAmount } from "../utils/setTVLChart";
import { ILpTokenAmount } from "../utils/types";
import { getDecimal } from "../utils/utils";

export async function tvlBurnLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const block = ctx.substrate.block.height;
    const pairAddress = ctx.contractAddress.toLowerCase();
    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = item.lpSymbol;
    const [token, quoteToken] = lp_symbol.split(" ")[0].split("-");
    const [tokenDecimal, quoteTokenDecimal] = [
      getDecimal(token),
      getDecimal(quoteToken),
    ];

    const mint =
      pair.events["Burn(address,uint256,uint256,address)"].decode(ctx);

    const { amount0: _amount0, amount1: _amount1 } = mint;
    const amount0 = Number(_amount0) / Math.pow(10, tokenDecimal);
    const amount1 = Number(_amount1) / Math.pow(10, quoteTokenDecimal);
    const lpTokenAmount = ctx.store.getRepository(LpTokenAmount);
    const lpTokenAmountLength = await lpTokenAmount.count();

    let tokenAmount = 0;
    let quoteTokenAmount = 0;
    if (lpTokenAmountLength) {
      const lastLpTokenAmount = await lpTokenAmount.find({
        idInt: lpTokenAmountLength - 1,
      });
      tokenAmount = Number(lastLpTokenAmount[0].tokenAmount);
      quoteTokenAmount = Number(lastLpTokenAmount[0].quoteTokenAmount);
    }

    const lpTokenAmountParams: ILpTokenAmount = {
      id: `${lpTokenAmountLength}`,
      idInt: lpTokenAmountLength,
      token: token,
      quoteToken: quoteToken,
      tokenAmount: `${(amount0 + tokenAmount).toFixed(18)}`,
      quoteTokenAmount: `${(amount1 + quoteTokenAmount).toFixed(18)}`,
      block: block,
      txHash: ctx.txHash,
      lpAddress: pairAddress,
      event: "Burn",
    };
    await setLpTokenAmount(ctx, lpTokenAmountParams);
  } catch (e) {
    console.log("Burn Error: ", e, ctx.txHash);
  }
}
