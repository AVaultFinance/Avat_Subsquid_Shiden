import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress } from "../constants";
import { setLpPriceByParams } from "../store/lpPrice";
import {
  getLpTokenAmountParams,
  setLpTokenAmount,
} from "../store/lpTokenAmount";

export async function tvlMintLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const block = ctx.substrate.block.height;
    const pairAddress = ctx.contractAddress.toLowerCase();
    const txHash = ctx.txHash;
    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = item.lpSymbol.toLowerCase();
    const token0Symbol = item.token0Symbol;
    const token0Address = item.token0Address;
    const token1Symbol = item.token1Symbol;
    const token1Address = item.token1Address;
    const token0Decimals = item.token0Decimals;
    const token1Decimals = item.token1Decimals;

    const mint = pair.events["Mint(address,uint256,uint256)"].decode(ctx);

    const { amount0: _amount0, amount1: _amount1 } = mint;

    let amount0 = Number(_amount0) / Math.pow(10, token0Decimals);
    let amount1 = Number(_amount1) / Math.pow(10, token1Decimals);

    if (token0Address > token1Address) {
      amount0 = Number(_amount1) / Math.pow(10, token1Decimals);
      amount1 = Number(_amount0) / Math.pow(10, token0Decimals);
    }

    const lpTokenAmountParams = await getLpTokenAmountParams({
      ctx,
      token0Symbol,
      token0Address,
      token1Symbol,
      token1Address,
      block,
      txHash,
      lpAddress: pairAddress,
    });

    let tokenAmount = Number(lpTokenAmountParams.token0Amount);
    let token1Amount = Number(lpTokenAmountParams.token1Amount);
    lpTokenAmountParams.token0Amount = `${(amount0 + tokenAmount).toFixed(18)}`;
    lpTokenAmountParams.token1Amount = `${(amount1 + token1Amount).toFixed(
      18
    )}`;
    lpTokenAmountParams.event = "Mint";

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
    //     event: "Mint",
    //   });
    // }
  } catch (e) {
    console.log("Mint Error: ", e, ctx.txHash);
  }
}
