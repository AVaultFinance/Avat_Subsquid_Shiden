import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress } from "../constants";
import { LpTokenAmount } from "../model/generated/lpTokenAmount.model";
import {
  calcLpPrice,
  getLpPriceParams,
  setLpPrice,
  setLpPriceByParams,
} from "../store/lpPrice";
import { getLpTokenAmountParams } from "../store/lpTokenAmount";
import { getLpTotalSupplyAmount } from "../store/lpTotalSupplyAmount";
import { setTokenPriceByParams } from "../store/tokenPrice";
import { setLpTokenAmount } from "../utils/setTVLChart";
import { ILpTokenAmount } from "../utils/types";
import { getDecimal } from "../utils/utils";

export async function tvlBurnLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const block = ctx.substrate.block.height;
    const txHash = ctx.txHash;
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
      lpPriceSymbol: quoteToken,
      block,
      txHash,
      quoteTokenAmount: lpTokenAmountParams.quoteTokenAmount,
      event: "Burn",
    });
    await setTokenPriceByParams({
      lpPrice: result.lpPrice,
      quoteTokenSymbol: quoteToken,
      tokenSymbol: token,
      tokenAmount: lpTokenAmountParams.tokenAmount,
      totalSupply: result.totalSupply,
      ctx,
      block,
      txHash,
      event: "Burn",
    });
  } catch (e) {
    console.log("Burn Error: ", e, ctx.txHash);
  }
}
