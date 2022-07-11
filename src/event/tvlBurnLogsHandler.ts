import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress, stable_symbol } from "../constants";
import { setLpPriceByParams } from "../store/lpPrice";
import {
  getLpTokenAmountParams,
  setLpTokenAmount,
} from "../store/lpTokenAmount";
import { setTokenPriceByParams } from "../store/tokenPrice";

export async function tvlBurnLogsHandler(
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

    const burn =
      pair.events["Burn(address,uint256,uint256,address)"].decode(ctx);

    const { amount0: _amount0, amount1: _amount1 } = burn;

    let amount0 = Number(_amount0) / Math.pow(10, tokenDecimal);
    let amount1 = Number(_amount1) / Math.pow(10, quoteTokenDecimal);

    if (tokenAddress > quoteTokenAddress) {
      amount0 = Number(_amount1) / Math.pow(10, quoteTokenDecimal);
      amount1 = Number(_amount0) / Math.pow(10, tokenDecimal);
    }
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
    lpTokenAmountParams.tokenAmount = `${(tokenAmount - amount0).toFixed(18)}`;
    lpTokenAmountParams.quoteTokenAmount = `${(
      quoteTokenAmount - amount1
    ).toFixed(18)}`;
    lpTokenAmountParams.event = "Burn";
    // const lpTokenAmountParams: ILpTokenAmount = {
    //   id: `${lpTokenAmountLength}`,
    //   idInt: lpTokenAmountLength,
    //   token: token,
    //   quoteToken: quoteToken,
    //   tokenAmount: `${(tokenAmount - amount0).toFixed(18)}`,
    //   quoteTokenAmount: `${(quoteTokenAmount - amount1).toFixed(18)}`,
    //   block: block,
    //   txHash: ctx.txHash,
    //   lpAddress: pairAddress,
    //   event: "Burn",
    // };
    await setLpTokenAmount(ctx, lpTokenAmountParams);
    const result = await setLpPriceByParams({
      ctx,
      lpAddress: pairAddress,
      lpSymbol: lp_symbol,
      block,
      txHash,
      quoteTokenAmount: lpTokenAmountParams.quoteTokenAmount,
      event: "Burn",
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
        event: "Burn",
      });
    }
  } catch (e) {
    console.log("Burn Error: ", e, ctx.txHash);
  }
}
