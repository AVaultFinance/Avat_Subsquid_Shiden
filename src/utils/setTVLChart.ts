import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { TVLChart } from "../model";

interface ITVLChart {
  id: string;
  currentTimestamp: bigint;
  endTimestamp: bigint;
  value: number;
  block: bigint;
}

export async function setTVLChart(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart,
  lpPrice: number
) {
  await ctx.store.save(
    new TVLChart({
      id: chartValue.id,
      currentTimestamp: chartValue.currentTimestamp,
      endTimestamp: chartValue.endTimestamp,
      value: Number((chartValue.value * lpPrice).toFixed(2)),
      block: chartValue.block,
    })
  );
}
