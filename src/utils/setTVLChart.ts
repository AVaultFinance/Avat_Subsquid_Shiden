import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { TVLChart } from "../model";
import { LpPrice } from "../model/generated/lpPrice.model";
import { ILpPrice, ITVLChart } from "./types";

export async function setTVLChart(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart
) {
  await ctx.store.save(new TVLChart(chartValue));
}

export async function setLpPrice(ctx: EvmLogHandlerContext, lpPrice: ILpPrice) {
  await ctx.store.save(new LpPrice(lpPrice));
}
