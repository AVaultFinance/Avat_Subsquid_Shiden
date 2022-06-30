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

export interface ILpTotalSupplyAmount {
  id: string;
  idInt: number;
  totalSupply: string;
  fromAddress: string;
  toAddress: string;
  block: number;
  txHash: string;
  lpAddress: string;
  value: string;
  event: string;
}

export interface ILpTokenAmount {
  id: string;
  idInt: number;
  token: string;
  quoteToken: string;
  tokenAmount: string;
  quoteTokenAmount: string;
  block: number;
  txHash: string;
  lpAddress: string;
  event: string;
}

export interface ITokenPrice {
  id: string;
  idInt: number;
  tokenPrice: string;
  tokenAddress: string;
  tokenSymbol: string;
  event: string;
  block: number;
  txHash: string;
}

export interface ISqlLpPrice {
  id: string;
  id_int: number;
  lp_price: string;
  lp_address: string;
  lp_symbol: string;
  lp_price_symbol: string;
  event: string;
  block: number;
  tx_hash: string;
}

export interface ILpPrice {
  id: string;
  idInt: number;
  lpPrice: string;
  lpAddress: string;
  lpSymbol: string;
  lpPriceSymbol: string;
  event: string;
  block: number;
  txHash: string;
}

export const ISqlLpPriceUtils = (params: ISqlLpPrice): ILpPrice => {
  return {
    id: params.id,
    idInt: params.id_int,
    lpPrice: params.lp_price,
    lpAddress: params.lp_address,
    lpSymbol: params.lp_symbol,
    lpPriceSymbol: params.lp_price_symbol,
    event: params.event,
    block: params.block,
    txHash: params.tx_hash,
  };
};
