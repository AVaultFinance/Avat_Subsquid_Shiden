import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { TVLChart } from "../model";
import { LpTokenAmount } from "../model/generated/lpTokenAmount.model";
import { ITVLChart } from "./types";

export async function setTVLChart(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart
) {
  await ctx.store.save(new TVLChart(chartValue));
}
