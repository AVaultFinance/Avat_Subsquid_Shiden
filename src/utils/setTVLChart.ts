import { EvmLogHandlerContext, Store } from "@subsquid/substrate-evm-processor";
import { LpPrice, TVLChart } from "../model";

interface ITVLChart {
  id: string;
  currentTimestamp: bigint;
  endTimestamp: bigint;
  aLpAmount: number;
  block: number;
  lpPrice: LpPrice[];
}

export async function setTVLChart(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart
) {
  await ctx.store.save(
    new TVLChart({
      id: chartValue.id,
      currentTimestamp: chartValue.currentTimestamp,
      endTimestamp: chartValue.endTimestamp,
      aLpAmount: chartValue.aLpAmount,
      lpPrice: chartValue.lpPrice,
      block: chartValue.block,
    })
  );
}

export async function setTVLChartByLpPrice(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart,
  lpPrice: LpPrice[]
) {
  await ctx.store.save(
    new TVLChart({
      id: chartValue.id,
      currentTimestamp: chartValue.currentTimestamp,
      endTimestamp: chartValue.endTimestamp,
      aLpAmount: chartValue.aLpAmount,
      lpPrice: lpPrice,
      block: chartValue.block,
    })
  );
}
