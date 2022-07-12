import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { stable_symbol } from "../constants";
import { LpPrice } from "../model";
import { getLpTotalSupplyAmount } from "./lpTotalSupplyAmount";
import { getTokenPrice } from "./tokenPrice";
import LPPrice from "./lpPrice.json";
interface ISqlLpPrice {
  id: string;
  id_int: number;
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
  lpSymbol,
}: {
  ctx: EvmLogHandlerContext;
  lpSymbol: string;
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
    // @ts-ignore
    ...LPPrice[lpSymbol],
    id: `${storeLen}`,
    idInt: storeLen,
  };
}

export async function getLpPriceParams({
  ctx,
  lpAddress,
  lpSymbol,
  block,
  txHash,
}: {
  ctx: EvmLogHandlerContext;
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
        lpAddress: lpAddress,
        lpSymbol: lpSymbol,
        block: block,
        txHash: txHash,
      };
    }
  }
  return {
    // @ts-ignore
    ...LPPrice[lpSymbol],
    id: `${storeLen}`,
    idInt: storeLen,
    lpAddress: lpAddress,
    lpSymbol: lpSymbol,
    block: block,
    txHash: txHash,
  };
}

export async function calcLpPrice({
  ctx,
  quoteTokenAmount,
  totalSupply,
  quoteTokenSymbol,
}: {
  ctx: EvmLogHandlerContext;
  quoteTokenAmount: string;
  totalSupply: string;
  quoteTokenSymbol: string;
}) {
  const _quoteTokenAmount = Number(quoteTokenAmount);
  const _totalSupply = Number(totalSupply);
  let lpPrice = (_quoteTokenAmount * 2) / _totalSupply;
  if (quoteTokenSymbol === stable_symbol) {
    return lpPrice.toFixed(18);
  } else {
    const lastQuotePrice = await getTokenPrice({
      ctx,
      symbol: quoteTokenSymbol,
    });
    if (lastQuotePrice) {
      lpPrice = Number(lpPrice) * Number(lastQuotePrice.tokenPrice);
      return lpPrice.toFixed(18);
    }
  }
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
  quoteTokenAmount,
  event,
  quoteTokenSymbol,
}: {
  ctx: EvmLogHandlerContext;
  lpAddress: string;
  lpSymbol: string;
  block: number;
  txHash: string;
  quoteTokenAmount: string;
  event: string;
  quoteTokenSymbol: string;
}) {
  // setLpPrice
  let lpPriceParams = await getLpPriceParams({
    ctx,
    lpAddress,
    lpSymbol,
    block,
    txHash,
  });
  const lpTotalSupplyAmount = await getLpTotalSupplyAmount({
    ctx,
    lpAddress,
  });
  const lpPrice = await calcLpPrice({
    ctx: ctx,
    totalSupply: lpTotalSupplyAmount.totalSupply,
    quoteTokenAmount: quoteTokenAmount,
    quoteTokenSymbol: quoteTokenSymbol,
  });

  if (lpPrice) {
    lpPriceParams.event = event;
    lpPriceParams.lpPrice = lpPrice;
    await setLpPrice(ctx, lpPriceParams);
    return {
      lpPrice: lpPrice,
      totalSupply: lpTotalSupplyAmount.totalSupply,
    };
  }
}
