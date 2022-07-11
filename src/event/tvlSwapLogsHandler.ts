import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress, stable_symbol } from "../constants";
import { setLpPriceByParams } from "../store/lpPrice";
import {
  getLpTokenAmountParams,
  setLpTokenAmount,
} from "../store/lpTokenAmount";
import { setTokenPriceByParams } from "../store/tokenPrice";
export async function tvlSwapLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const block = ctx.substrate.block.height;
    const txHash = ctx.txHash;
    const pairAddress = ctx.contractAddress.toLowerCase();
    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = item.lpSymbol.toLowerCase();
    const token = item.token;
    const tokenAddress = item.tokenAddress;
    const quoteToken = item.quoteToken;
    const quoteTokenAddress = item.quoteTokenAddress;
    const tokenDecimal = item.tokenDecimals;
    const quoteTokenDecimal = item.quoteTokenDecimals;

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

    let amount0In = Number(_amount0In) / Math.pow(10, tokenDecimal);
    let amount0Out = Number(_amount0Out) / Math.pow(10, tokenDecimal);
    let amount1In = Number(_amount1In) / Math.pow(10, quoteTokenDecimal);
    let amount1Out = Number(_amount1Out) / Math.pow(10, quoteTokenDecimal);

    if (tokenAddress > quoteTokenAddress) {
      amount0In = Number(_amount1In) / Math.pow(10, quoteTokenDecimal);
      amount0Out = Number(_amount1Out) / Math.pow(10, quoteTokenDecimal);
      amount1In = Number(_amount0In) / Math.pow(10, tokenDecimal);
      amount1Out = Number(_amount0Out) / Math.pow(10, tokenDecimal);
    }
    // console.log(
    //   "Swap: ",
    //   ctx.txHash,
    //   amount0In,
    //   amount0Out,
    //   amount1In,
    //   amount1Out
    // );
    // const lpTokenAmount = ctx.store.getRepository(LpTokenAmount);
    // const lpTokenAmountLength = await lpTokenAmount.count();

    const lpTokenAmountParams = await getLpTokenAmountParams({
      ctx,
      token,
      quoteToken,
      block,
      txHash,
      lpAddress: pairAddress,
    });

    let tokenAmount = Number(lpTokenAmountParams.tokenAmount);
    let quoteTokenAmount = Number(lpTokenAmountParams.quoteTokenAmount);

    if (amount0In === 0) {
      tokenAmount = tokenAmount - amount0Out;
      quoteTokenAmount = quoteTokenAmount + amount1In;
    }
    if (amount0Out === 0) {
      tokenAmount = tokenAmount + amount0In;
      quoteTokenAmount = quoteTokenAmount - amount1Out;
    }

    lpTokenAmountParams.tokenAmount = `${tokenAmount.toFixed(18)}`;
    lpTokenAmountParams.quoteTokenAmount = `${quoteTokenAmount.toFixed(18)}`;
    lpTokenAmountParams.event = "Swap";

    await setLpTokenAmount(ctx, lpTokenAmountParams);

    const result = await setLpPriceByParams({
      ctx,
      lpAddress: pairAddress,
      lpSymbol: lp_symbol,
      block,
      txHash,
      quoteTokenAmount: lpTokenAmountParams.quoteTokenAmount,
      event: "Swap",
      quoteTokenSymbol: quoteToken,
    });
    if (result) {
      await setTokenPriceByParams({
        lpPrice: result.lpPrice,
        tokenSymbol: token,
        tokenAmount: lpTokenAmountParams.tokenAmount,
        totalSupply: result.totalSupply,
        ctx,
        block,
        txHash,
        event: "Swap",
      });
    }
  } catch (e) {
    console.log("Swap Error: ", e, ctx.txHash);
    // console.log(e);
  }
}
