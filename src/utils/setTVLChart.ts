import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { TVLChart } from "../model";
import { LpPrice } from "../model/generated/lpPrice.model";
import { LpTokenAmount } from "../model/generated/lpTokenAmount.model";
import { LpTotalSupplyAmount } from "../model/generated/lpTotalSupplyAmount.model";
import {
  ILpPrice,
  ILpTokenAmount,
  ILpTotalSupplyAmount,
  ITVLChart,
} from "./types";

export async function setTVLChart(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart
) {
  await ctx.store.save(new TVLChart(chartValue));
}

export async function setLpPrice(ctx: EvmLogHandlerContext, lpPrice: ILpPrice) {
  await ctx.store.save(new LpPrice(lpPrice));
}

export async function setLpTotalSupplyAmount(
  ctx: EvmLogHandlerContext,
  params: ILpTotalSupplyAmount
) {
  await ctx.store.save(new LpTotalSupplyAmount(params));
}

export async function setLpTokenAmount(
  ctx: EvmLogHandlerContext,
  params: ILpTokenAmount
) {
  await ctx.store.save(new LpTokenAmount(params));
}
