export interface ISqlTVLChart {
  id: string;
  id_int: number;
  current_timestamp: string;
  end_timestamp: string;
  a_lp_amount: string;
  a_lp_address: string;
  lp_price: string[];
  tx_hash: string;
  block: number;
}
export interface ITVLChart {
  id: string;
  idInt: number;
  currentTimestamp: bigint;
  endTimestamp: bigint;
  aLpAmount: number;
  aLpAddress: string;
  lpPrice: string[];
  txHash: string;
  block: number;
}
export const ISqlTVLChartUtils = (params: ISqlTVLChart): ITVLChart => {
  return {
    id: params.id,
    idInt: params.id_int,
    currentTimestamp: BigInt(params.current_timestamp),
    endTimestamp: BigInt(params.end_timestamp),
    aLpAmount: Number(params.a_lp_amount),
    aLpAddress: params.a_lp_address,
    lpPrice: params.lp_price,
    txHash: params.tx_hash,
    block: params.block,
  };
};
