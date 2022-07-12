import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { TVLChart } from "../model";
export interface ISqlTVLChart {
  id: string;
  id_int: number;
  current_timestamp: string;
  end_timestamp: string;
  total_a_lp_amount_usd: string;
  a_lp_amount: string;
  a_lp_amount_usd: string;
  a_lp_address: string;
  lp_price: string;
  tx_hash: string;
  block: number;
  event: string;
}
export interface ITVLChart {
  id: string;
  idInt: number;
  currentTimestamp: bigint;
  endTimestamp: bigint;
  totalALpAmountUsd: string;
  aLpAmount: string;
  aLpAmountUsd: string;
  aLpAddress: string;
  lpPrice: string;
  txHash: string;
  block: number;
  event: string;
}
export const ISqlTVLChartUtils = (params: ISqlTVLChart): ITVLChart => {
  return {
    id: params.id,
    idInt: params.id_int,
    currentTimestamp: BigInt(params.current_timestamp),
    endTimestamp: BigInt(params.end_timestamp),
    totalALpAmountUsd: params.total_a_lp_amount_usd,
    aLpAmount: params.a_lp_amount,
    aLpAmountUsd: params.a_lp_amount_usd,
    aLpAddress: params.a_lp_address,
    lpPrice: params.lp_price,
    txHash: params.tx_hash,
    block: params.block,
    event: params.event,
  };
};

export async function setTVLChart(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart
) {
  await ctx.store.save(new TVLChart(chartValue));
}
