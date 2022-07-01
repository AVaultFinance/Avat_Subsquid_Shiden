import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { TokenPrice } from "../model";

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
export async function getTokenPrice({
  ctx,
}: {
  ctx: EvmLogHandlerContext;
}): Promise<ITokenPrice> {
  const store = ctx.store.getRepository(TokenPrice);
  const storeLen = await store.count();
  if (storeLen) {
    const lastStore = await store.find({
      idInt: storeLen - 1,
    });
    return lastStore[0];
  }
  return {
    id: "0",
    idInt: 0,
    tokenPrice: "0",
    tokenAddress: "",
    tokenSymbol: "",
    event: "",
    block: 0,
    txHash: "",
  };
}

export async function getTokenPriceParams({
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
      tokenSymbol: tokenSymbol,
      id: `${storeLen}`,
      idInt: storeLen,
      block: block,
      txHash: txHash,
    };
  }
  return {
    id: "0",
    idInt: 0,
    event: "",
    tokenPrice: "0",
    tokenAddress: "",
    tokenSymbol: tokenSymbol,
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
  await ctx.store.save(new TokenPrice(params));
}
