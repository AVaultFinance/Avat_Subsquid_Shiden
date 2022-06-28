export interface ISqlTVLChart {
  id: string;
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
    currentTimestamp: BigInt(params.current_timestamp),
    endTimestamp: BigInt(params.end_timestamp),
    aLpAmount: Number(params.a_lp_amount),
    aLpAddress: params.a_lp_address,
    lpPrice: params.lp_price,
    txHash: params.tx_hash,
    block: params.block,
  };
};

export interface ISqlLpPrice {
  id: string;
  lp_price: string;
  lp_address: string;
  block: number;
  event: string;
  tx_hash: string;
  total_supply: string;
}

export interface ILpPrice {
  id: string;
  lpPrice: string;
  lpAddress: string;
  block: number;
  event: string;
  txHash: string;
  totalSupply: string;
}

export const ISqlLpPriceUtils = (params: ISqlLpPrice): ILpPrice => {
  return {
    id: params.id,
    lpPrice: params.lp_price,
    lpAddress: params.lp_address,
    block: params.block,
    event: params.event,
    txHash: params.tx_hash,
    totalSupply: params.total_supply,
  };
};
