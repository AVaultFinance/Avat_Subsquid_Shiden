import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { stable_symbol } from "../constants";
import { LpPrice } from "../model";
import { getLpTotalSupplyAmount } from "./lpTotalSupplyAmount";

interface ISqlLpPrice {
  id: string;
  id_int: number;
  token0_address: string;
  token0_price: string;
  token0_symbol: string;
  token1_address: string;
  token1_price: string;
  token1_symbol: string;
  lp_price: string;
  lp_address: string;
  lp_symbol: string;
  event: string;
  block: number;
  tx_hash: string;
}

export interface ILpPrice {
  id: string;
  idInt: number;
  token0Address: string;
  token0Price: string;
  token0Symbol: string;
  token1Address: string;
  token1Price: string;
  token1Symbol: string;
  lpPrice: string;
  lpAddress: string;
  lpSymbol: string;
  event: string;
  block: number;
  txHash: string;
}

const ISqlLpPriceUtils = (params: ISqlLpPrice): ILpPrice => {
  return {
    id: params.id,
    idInt: params.id_int,
    token0Address: params.token0_address,
    token0Price: params.token0_price,
    token0Symbol: params.token0_symbol,
    token1Address: params.token1_address,
    token1Price: params.token1_price,
    token1Symbol: params.token1_symbol,
    lpPrice: params.lp_price,
    lpAddress: params.lp_address,
    lpSymbol: params.lp_symbol,
    event: params.event,
    block: params.block,
    txHash: params.tx_hash,
  };
};
export async function getLpPrice({
  ctx,
  lpAddress,
  lpSymbol,
  token0Symbol,
  token0Address,
  token1Symbol,
  token1Address,
}: {
  ctx: EvmLogHandlerContext;
  lpAddress: string;
  lpSymbol: string;
  token0Symbol: string;
  token0Address: string;
  token1Symbol: string;
  token1Address: string;
}): Promise<ILpPrice> {
  const store = ctx.store.getRepository(LpPrice);
  const storeLen = await store.count();
  if (storeLen) {
    const storeArr: ISqlLpPrice[] = await store.query(
      `
        SELECT * from lp_price
        where lp_symbol='${lpSymbol}'
      `
    );
    if (storeArr && storeArr.length) {
      const lastStore = ISqlLpPriceUtils(storeArr[storeArr.length - 1]);
      return lastStore;
    }
  }
  return {
    id: `${storeLen}`,
    idInt: storeLen,
    token0Price: "1",
    token0Address: token0Address,
    token0Symbol: token0Symbol,

    token1Price: "1",
    token1Address: token1Address,
    token1Symbol: token1Symbol,

    lpPrice: "1",
    lpAddress: lpAddress,
    lpSymbol: lpSymbol,
    event: "",
    block: 0,
    txHash: "",
  };
}

export async function getLpPriceParams({
  ctx,
  token0Symbol,
  token0Address,
  token1Symbol,
  token1Address,
  lpAddress,
  lpSymbol,
  block,
  txHash,
}: {
  ctx: EvmLogHandlerContext;
  token0Symbol: string;
  token0Address: string;
  token1Symbol: string;
  token1Address: string;
  lpAddress: string;
  lpSymbol: string;
  block: number;
  txHash: string;
}): Promise<ILpPrice> {
  const store = ctx.store.getRepository(LpPrice);
  const storeLen = await store.count();
  if (storeLen) {
    const storeArr: ISqlLpPrice[] = await store.query(
      `
        SELECT * from lp_price
        where lp_symbol='${lpSymbol}'
      `
    );
    if (storeArr && storeArr.length) {
      const lastStore = ISqlLpPriceUtils(storeArr[storeArr.length - 1]);
      return {
        ...lastStore,
        event: "",
        id: `${storeLen}`,
        idInt: storeLen,

        token0Address: token0Address,
        token0Symbol: token0Symbol,

        token1Address: token1Address,
        token1Symbol: token1Symbol,
        lpAddress: lpAddress,
        lpSymbol: lpSymbol,
        block: block,
        txHash: txHash,
      };
    }
  }
  return {
    id: `${storeLen}`,
    idInt: storeLen,

    token0Price: "1",
    token0Address: token0Address,
    token0Symbol: token0Symbol,

    token1Price: "1",
    token1Address: token1Address,
    token1Symbol: token1Symbol,

    lpPrice: "1",
    lpAddress: lpAddress,
    lpSymbol: lpSymbol,
    event: "",
    block: 0,
    txHash: "",
  };
}

// export async function calcLpPrice({
//   ctx,
//   token1Amount,
//   token1Symbol,
//   totalSupply,
// }: {
//   ctx: EvmLogHandlerContext;
//   token1Amount: string;
//   token1Symbol: string;
//   totalSupply: string;
// }) {
//   const _token1Amount = Number(token1Amount);
//   const _totalSupply = Number(totalSupply);
//   let lpPrice = (_token1Amount * 2) / _totalSupply;
//   if (token1Symbol === stable_symbol) {
//     return lpPrice.toFixed(18);
//   } else {
//     const lastQuotePrice = await getTokenPrice({
//       ctx,
//       symbol: token1Symbol,
//     });
//     if (lastQuotePrice) {
//       lpPrice = Number(lpPrice) * Number(lastQuotePrice.tokenPrice);
//       return lpPrice.toFixed(18);
//     }
//   }
// }
export async function calcLpPrice({
  lpDecimals,
  token0Amount,
  token0Decimals,
  token0Symbol,
  token1Amount,
  token1Decimals,
  totalSupply,
  token1Symbol,
  tokenPrice,
}: {
  lpDecimals: number;
  token0Amount: string;
  token0Decimals: number;
  token0Symbol: string;
  token1Amount: string;
  token1Decimals: number;
  totalSupply: string;
  token1Symbol: string;
  tokenPrice?: string;
}) {
  const _token0Amount = Number(token0Amount);
  const _token1Amount = Number(token1Amount);
  const _totalSupply = Number(totalSupply);
  let lpPrice =
    ((_token1Amount / Math.pow(10, token1Decimals)) * 2) /
    (_totalSupply / Math.pow(10, lpDecimals));
  let token0Price =
    _token1Amount /
    Math.pow(10, token1Decimals) /
    (_token0Amount / Math.pow(10, token0Decimals));
  let token1Price = 1;
  if (token1Symbol.toLowerCase() === stable_symbol) {
  } else if (token0Symbol.toLowerCase() === stable_symbol) {
    lpPrice =
      ((_token0Amount / Math.pow(10, token0Decimals)) * 2) /
      (_totalSupply / Math.pow(10, lpDecimals));
    token0Price = 1;
    token1Price =
      _token0Amount /
      Math.pow(10, token0Decimals) /
      (_token1Amount / Math.pow(10, token1Decimals));
  } else {
    if (tokenPrice) {
      lpPrice = lpPrice * Number(tokenPrice);
      token0Price = token0Price * Number(tokenPrice);
      token1Price = Number(tokenPrice);
    }
  }
  return {
    token1Price: token1Price.toFixed(18),
    token0Price: token0Price.toFixed(18),
    lpPrice: lpPrice.toFixed(18),
  };
}

export async function setLpPrice(ctx: EvmLogHandlerContext, lpPrice: ILpPrice) {
  if (lpPrice.lpPrice && Number(lpPrice.lpPrice) === 0) {
    return;
  }
  await ctx.store.save(new LpPrice(lpPrice));
}

export async function setLpPriceByParams({
  ctx,
  lpAddress,
  lpSymbol,
  block,
  txHash,
  token0Amount,
  token0Decimals,
  token0Symbol,
  token0Address,
  token1Amount,
  token1Decimals,
  token1Symbol,
  token1Address,
  event,
}: {
  ctx: EvmLogHandlerContext;
  lpAddress: string;
  lpSymbol: string;
  block: number;
  txHash: string;
  token0Address: string;
  token0Amount: string;
  token0Decimals: number;
  token0Symbol: string;
  token1Address: string;
  token1Amount: string;
  token1Decimals: number;
  token1Symbol: string;
  event: string;
}) {
  // setLpPrice
  let lpPriceParams = await getLpPriceParams({
    ctx,
    token0Symbol,
    token0Address,
    token1Symbol,
    token1Address,
    lpAddress,
    lpSymbol,
    block,
    txHash,
  });
  const lpTotalSupplyAmount = await getLpTotalSupplyAmount({
    ctx,
    lpAddress,
  });
  let tokenPrice = "";
  if (token0Symbol !== stable_symbol || token1Symbol !== stable_symbol) {
    tokenPrice = lpPriceParams.token0Price;
  }
  const { lpPrice, token1Price, token0Price } = await calcLpPrice({
    totalSupply: lpTotalSupplyAmount.totalSupply,
    lpDecimals: 18,
    token0Amount: token0Amount,
    token0Decimals,
    token0Symbol,
    token1Amount,
    token1Decimals,
    token1Symbol,
    tokenPrice,
  });

  if (lpPrice) {
    lpPriceParams.event = event;
    lpPriceParams.lpPrice = lpPrice;
    lpPriceParams.token0Price = token0Price;
    lpPriceParams.token1Price = token1Price;
    await setLpPrice(ctx, lpPriceParams);
    return {
      lpPrice: lpPrice,
      totalSupply: lpTotalSupplyAmount.totalSupply,
    };
  }
}
