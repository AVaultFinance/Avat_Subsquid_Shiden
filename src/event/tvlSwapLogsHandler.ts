import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress } from "../constants";
import { setLpPriceByParams } from "../store/lpPrice";
import {
  getLpTokenAmountParams,
  setLpTokenAmount,
} from "../store/lpTokenAmount";
export async function tvlSwapLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const block = ctx.substrate.block.height;
    const txHash = ctx.txHash;
    const pairAddress = ctx.contractAddress.toLowerCase();
    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = item.lpSymbol.toLowerCase();
    const token0Symbol = item.token0Symbol;
    const token0Address = item.token0Address;
    const token1Symbol = item.token1Symbol;
    const token1Address = item.token1Address;
    const token0Decimals = item.token0Decimals;
    const token1Decimals = item.token1Decimals;

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

    let amount0In = Number(_amount0In) / Math.pow(10, token0Decimals);
    let amount0Out = Number(_amount0Out) / Math.pow(10, token0Decimals);
    let amount1In = Number(_amount1In) / Math.pow(10, token1Decimals);
    let amount1Out = Number(_amount1Out) / Math.pow(10, token1Decimals);

    if (token0Address > token1Address) {
      amount0In = Number(_amount1In) / Math.pow(10, token1Decimals);
      amount0Out = Number(_amount1Out) / Math.pow(10, token1Decimals);
      amount1In = Number(_amount0In) / Math.pow(10, token0Decimals);
      amount1Out = Number(_amount0Out) / Math.pow(10, token0Decimals);
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
      token0Symbol,
      token1Symbol,
      block,
      txHash,
      lpAddress: pairAddress,
    });

    let tokenAmount = Number(lpTokenAmountParams.token0Amount);
    let token1Amount = Number(lpTokenAmountParams.token1Amount);

    if (amount0In === 0) {
      tokenAmount = tokenAmount - amount0Out;
      token1Amount = token1Amount + amount1In;
    }
    if (amount0Out === 0) {
      tokenAmount = tokenAmount + amount0In;
      token1Amount = token1Amount - amount1Out;
    }

    lpTokenAmountParams.token0Amount = `${tokenAmount.toFixed(18)}`;
    lpTokenAmountParams.token1Amount = `${token1Amount.toFixed(18)}`;
    lpTokenAmountParams.event = "Swap";

    await setLpTokenAmount(ctx, lpTokenAmountParams);

    await setLpPriceByParams({
      ctx,
      lpAddress: pairAddress,
      lpSymbol: lp_symbol,
      block,
      txHash,
      token0Amount: lpTokenAmountParams.token0Amount,
      token0Decimals,
      token0Symbol,
      token0Address,
      token1Amount: lpTokenAmountParams.token1Amount,
      token1Decimals,
      token1Symbol,
      token1Address,
      event: "Burn",
    });
    // if (result) {
    //   await setTokenPriceByParams({
    //     lpPrice: result.lpPrice,
    //     token0: token0,
    //     tokenAmount: lpTokenAmountParams.tokenAmount,
    //     totalSupply: result.totalSupply,
    //     ctx,
    //     block,
    //     txHash,
    //     event: "Swap",
    //   });
    // }
  } catch (e) {
    console.log("Swap Error: ", e, ctx.txHash);
    // console.log(e);
  }
}
