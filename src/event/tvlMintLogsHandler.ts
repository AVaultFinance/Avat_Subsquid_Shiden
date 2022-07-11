import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress } from "../constants";
import { setLpPriceByParams } from "../store/lpPrice";
import {
  getLpTokenAmountParams,
  setLpTokenAmount,
} from "../store/lpTokenAmount";
import { setTokenPriceByParams } from "../store/tokenPrice";

export async function tvlMintLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const block = ctx.substrate.block.height;
    const pairAddress = ctx.contractAddress.toLowerCase();
    const txHash = ctx.txHash;
    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = item.lpSymbol.toLowerCase();
    const token = item.token;
    const tokenAddress = item.tokenAddress;
    const quoteToken = item.quoteToken;
    const quoteTokenAddress = item.quoteTokenAddress;
    const tokenDecimal = item.tokenDecimals;
    const quoteTokenDecimal = item.quoteTokenDecimals;

    const mint = pair.events["Mint(address,uint256,uint256)"].decode(ctx);

    const { amount0: _amount0, amount1: _amount1 } = mint;

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
    lpTokenAmountParams.tokenAmount = `${(amount0 + tokenAmount).toFixed(18)}`;
    lpTokenAmountParams.quoteTokenAmount = `${(
      amount1 + quoteTokenAmount
    ).toFixed(18)}`;
    lpTokenAmountParams.event = "Mint";

    await setLpTokenAmount(ctx, lpTokenAmountParams);

    const result = await setLpPriceByParams({
      ctx,
      lpAddress: pairAddress,
      lpSymbol: lp_symbol,
      quoteTokenSymbol: quoteToken,
      block,
      txHash,
      quoteTokenAmount: lpTokenAmountParams.quoteTokenAmount,
      event: "Mint",
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
        event: "Mint",
      });
    }
  } catch (e) {
    console.log("Mint Error: ", e, ctx.txHash);
  }
}
