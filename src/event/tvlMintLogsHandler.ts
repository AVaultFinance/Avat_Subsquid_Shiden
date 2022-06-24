import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import * as pair from "../abi/PancakePair";
import { aKSU, wSDN_USDC_LP } from "../constants";
import { TVLChart } from "../model";
import { setTVLChart } from "../utils/setTVLChart";

export async function tvlMintLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress;
    if (pairAddress === wSDN_USDC_LP) {
      const mint = pair.events["Mint(address,uint256,uint256)"].decode(ctx);
      const charts = await ctx.store.getRepository(TVLChart);
      const chartsLength = await charts.count();
      if (chartsLength) {
        // const chart = await charts.find({
        //   id: ctx.substrate.block.height.toString(),
        // });
        // if (chart) {
        //   console.log(chart);
        // }
        console.log(mint);
      }
    }
  } catch (e) {
    console.log("error: ", e, ctx.txHash);
    // console.log(e);
  }
}
