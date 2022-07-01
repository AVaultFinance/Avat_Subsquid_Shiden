import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { TVLChart } from "../model";
import { LpTokenAmount } from "../model/generated/lpTokenAmount.model";
import { ILpTokenAmount, ITVLChart } from "./types";

export async function setTVLChart(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart
) {
  await ctx.store.save(new TVLChart(chartValue));
}

export async function setLpTokenAmount(
  ctx: EvmLogHandlerContext,
  params: ILpTokenAmount
) {
  await ctx.store.save(new LpTokenAmount(params));
}
