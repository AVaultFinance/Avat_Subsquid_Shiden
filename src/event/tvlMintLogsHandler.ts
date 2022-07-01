import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { lpAddress } from "../constants";
import { setLpPriceByParams } from "../store/lpPrice";
import { getLpTokenAmountParams } from "../store/lpTokenAmount";
import { setLpTokenAmount } from "../utils/setTVLChart";
import { getDecimal } from "../utils/utils";

export async function tvlMintLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const block = ctx.substrate.block.height;
    const pairAddress = ctx.contractAddress.toLowerCase();
    const txHash = ctx.txHash;
    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = item.lpSymbol;
    const [token, quoteToken] = lp_symbol.split(" ")[0].split("-");
    const [tokenDecimal, quoteTokenDecimal] = [
      getDecimal(token),
      getDecimal(quoteToken),
    ];

    const mint = pair.events["Mint(address,uint256,uint256)"].decode(ctx);

    const { amount0: _amount0, amount1: _amount1 } = mint;
    const amount0 = Number(_amount0) / Math.pow(10, tokenDecimal);
    const amount1 = Number(_amount1) / Math.pow(10, quoteTokenDecimal);
    // console.log(ctx.txHash, amount0, amount1, tokenDecimal, quoteTokenDecimal);

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

    await setLpPriceByParams({
      ctx,
      lpAddress: pairAddress,
      lpSymbol: lp_symbol,
      lpPriceSymbol: quoteToken,
      block,
      txHash,
      quoteTokenAmount: lpTokenAmountParams.quoteTokenAmount,
      event: "Mint",
    });
  } catch (e) {
    console.log("Mint Error: ", e, ctx.txHash);
  }
}
