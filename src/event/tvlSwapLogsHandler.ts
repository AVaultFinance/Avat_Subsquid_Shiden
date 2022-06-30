import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress } from "../constants";
import { LpTokenAmount } from "../model/generated/lpTokenAmount.model";
import { setLpTokenAmount } from "../utils/setTVLChart";
import { ILpTokenAmount } from "../utils/types";
import { getDecimal } from "../utils/utils";
export async function tvlSwapLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();
    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = item.lpSymbol;
    const [token, quoteToken] = lp_symbol.split(" ")[0].split("-");
    const [tokenDecimal, quoteTokenDecimal] = [
      getDecimal(token),
      getDecimal(quoteToken),
    ];

    const mint: pair.Swap0Event =
      pair.events[
        "Swap(address,uint256,uint256,uint256,uint256,address)"
      ].decode(ctx);
    const {
      amount0In: _amount0In,
      amount1In: _amount1In,
      amount0Out: _amount0Out,
      amount1Out: _amount1Out,
    } = mint;
    const amount0In = Number(_amount0In) / Math.pow(10, tokenDecimal);
    const amount0Out = Number(_amount0Out) / Math.pow(10, tokenDecimal);
    const amount1In = Number(_amount1In) / Math.pow(10, quoteTokenDecimal);
    const amount1Out = Number(_amount1Out) / Math.pow(10, quoteTokenDecimal);
    // console.log(
    //   "Swap: ",
    //   ctx.txHash,
    //   amount0In,
    //   amount0Out,
    //   amount1In,
    //   amount1Out
    // );
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

      if (amount0In === 0) {
        tokenAmount = tokenAmount - amount0Out;
        quoteTokenAmount = quoteTokenAmount + amount1In;
      }
      if (amount0Out === 0) {
        tokenAmount = tokenAmount + amount0In;
        quoteTokenAmount = quoteTokenAmount - amount1Out;
      }
    }

    const lpTokenAmountParams: ILpTokenAmount = {
      id: `${lpTokenAmountLength}`,
      idInt: lpTokenAmountLength,
      token: token,
      quoteToken: quoteToken,
      tokenAmount: `${tokenAmount.toFixed(18)}`,
      quoteTokenAmount: `${quoteTokenAmount.toFixed(18)}`,
      block: ctx.substrate.block.height,
      txHash: ctx.txHash,
      lpAddress: pairAddress,
      event: "Swap",
    };
    await setLpTokenAmount(ctx, lpTokenAmountParams);
  } catch (e) {
    console.log("Swap Error: ", e, ctx.txHash);
    // console.log(e);
  }
}
