import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { TokenPrice } from "../model";
import { symbolFormat } from "../utils/utils";
import TokenPriceJSON from "./tokenPrice.json";
export interface ITokenPrice {
  id: string;
  idInt: number;
  tokenPrice: string;
  tokenSymbol: string;
  event: string;
  block: number;
  txHash: string;
}
interface ISqlTokenPrice {
  id: string;
  id_int: number;
  token_price: string;
  token_symbol: string;
  event: string;
  block: number;
  tx_hash: string;
}
export async function getTokenPrice({
  ctx,
  symbol,
}: {
  ctx: EvmLogHandlerContext;
  symbol: string;
}): Promise<ITokenPrice> {
  const store = ctx.store.getRepository(TokenPrice);
  const len = await store.count();
  if (len) {
    const storeArr: ISqlTokenPrice[] = await store.query(
      `
        SELECT * from token_price
        where token_symbol='${symbolFormat(symbol)}'
      `
    );
    if (storeArr && storeArr.length) {
      return ISqlTokenPriceUtils(storeArr[storeArr.length - 1]);
    }
  }
  return {
    // @ts-ignore
    ...TokenPriceJSON[tokenSymbol],
    id: `${len}`,
    idInt: len,
  };
  // return {
  //   id: "0",
  //   idInt: 0,
  //   tokenPrice: "0",
  //   tokenSymbol: "",
  //   event: "",
  //   block: 0,
  //   txHash: "",
  // };
}
const ISqlTokenPriceUtils = (params: ISqlTokenPrice): ITokenPrice => {
  return {
    id: params.id,
    idInt: params.id_int,
    tokenPrice: params.token_price,
    tokenSymbol: params.token_symbol,
    event: params.event,
    block: params.block,
    txHash: params.tx_hash,
  };
};

async function getTokenPriceParams({
  ctx,
  block,
  txHash,
  tokenSymbol,
}: {
  ctx: EvmLogHandlerContext;
  block: number;
  txHash: string;
  tokenSymbol: string;
}): Promise<ITokenPrice> {
  const store = ctx.store.getRepository(TokenPrice);
  const storeLen = await store.count();
  if (storeLen) {
    const lastStore = await store.find({
      idInt: storeLen - 1,
    });
    return {
      ...lastStore[0],
      event: "",
      tokenSymbol: symbolFormat(tokenSymbol),
      id: `${storeLen}`,
      idInt: storeLen,
      block: block,
      txHash: txHash,
    };
  }
  // return {
  //   id: "0",
  //   idInt: 0,
  //   event: "",
  //   tokenPrice: "0",
  //   tokenSymbol: tokenSymbol,
  //   block: block,
  //   txHash: txHash,
  // };
  return {
    // @ts-ignore
    ...TokenPriceJSON[tokenSymbol],
    id: `${storeLen}`,
    idInt: storeLen,
    tokenSymbol: symbolFormat(tokenSymbol),
    block: block,
    txHash: txHash,
  };
}

export function calcTokenPrice({
  lpPrice,
  tokenAmount,
  totalSupply,
}: {
  lpPrice: string;
  tokenAmount: string;
  totalSupply: string;
}) {
  const _lpPrice = Number(lpPrice);
  const _tokenAmount = Number(tokenAmount);
  const _totalSupply = Number(totalSupply);
  const tokenPrice = (_lpPrice * _totalSupply) / (_tokenAmount * 2);
  return tokenPrice.toFixed(18);
}

export async function setTokenPrice(
  ctx: EvmLogHandlerContext,
  params: ITokenPrice
) {
  if (params.tokenPrice === "NaN" || Number(params.tokenPrice) === 0) {
    return;
  }
  await ctx.store.save(new TokenPrice(params));
}

export async function setTokenPriceByParams({
  lpPrice,
  tokenSymbol,
  tokenAmount,
  totalSupply,
  ctx,
  block,
  txHash,
  event,
}: {
  lpPrice: string;
  tokenSymbol: string;
  tokenAmount: string;
  totalSupply: string;
  ctx: EvmLogHandlerContext;
  block: number;
  txHash: string;
  event: string;
}) {
  const _tokenSymbol = symbolFormat(tokenSymbol);
  // ------tokenPrice------
  const tokenPriceParams = await getTokenPriceParams({
    ctx,
    block,
    txHash,
    tokenSymbol: _tokenSymbol,
  });
  tokenPriceParams.tokenPrice = calcTokenPrice({
    lpPrice: lpPrice,
    tokenAmount: tokenAmount,
    totalSupply: totalSupply,
  });
  tokenPriceParams.event = event;
  // --------------fixed some----------
  const lastQuotePrice = await getTokenPrice({
    ctx,
    symbol: _tokenSymbol,
  });

  // if (_quoteTokenSymbol === stable_symbol) {
  // console.log({ tokenPriceParams });
  await setTokenPrice(ctx, tokenPriceParams);
  // } else {
  //   const lastQuotePrice = await getTokenPrice({
  //     ctx,
  //     symbol: _quoteTokenSymbol,
  //   });
  //   if (lastQuotePrice) {
  //     tokenPriceParams.tokenPrice = (
  //       Number(tokenPriceParams.tokenPrice) * Number(lastQuotePrice.tokenPrice)
  //     ).toFixed(18);
  //     await setTokenPrice(ctx, tokenPriceParams);
  //   }
  // }
}
