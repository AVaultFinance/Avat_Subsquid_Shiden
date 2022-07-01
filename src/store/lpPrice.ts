import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { LpPrice } from "../model";
import { ILpPrice } from "../utils/types";
import { getLpTotalSupplyAmount } from "./lpTotalSupplyAmount";

export async function getLpPriceParams({
  ctx,
  lpAddress,
  lpSymbol,
  lpPriceSymbol,
  block,
  txHash,
}: {
  ctx: EvmLogHandlerContext;
  lpAddress: string;
  lpSymbol: string;
  lpPriceSymbol: string;
  block: number;
  txHash: string;
}): Promise<ILpPrice> {
  const store = ctx.store.getRepository(LpPrice);
  const storeLen = await store.count();
  if (storeLen) {
    const lastStore = await store.find({
      idInt: storeLen - 1,
    });
    return {
      ...lastStore[0],
      event: "",
      id: `${storeLen}`,
      idInt: storeLen,
      lpAddress: lpAddress,
      lpSymbol: lpSymbol,
      lpPriceSymbol: lpPriceSymbol,
      block: block,
      txHash: txHash,
    };
  }
  return {
    id: "0",
    idInt: 0,
    lpPrice: "0",
    event: "",
    lpAddress: lpAddress,
    lpSymbol: lpSymbol,
    lpPriceSymbol: lpPriceSymbol,
    block: block,
    txHash: txHash,
  };
}

export function calcLpPrice({
  quoteTokenAmount,
  totalSupply,
}: {
  quoteTokenAmount: string;
  totalSupply: string;
}) {
  const _quoteTokenAmount = Number(quoteTokenAmount);
  const _totalSupply = Number(totalSupply);
  const lpPrice = (_quoteTokenAmount * 2) / _totalSupply;
  return lpPrice.toFixed(18);
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
  lpPriceSymbol,
  block,
  txHash,
  quoteTokenAmount,
  event,
}: {
  ctx: EvmLogHandlerContext;
  lpAddress: string;
  lpSymbol: string;
  lpPriceSymbol: string;
  block: number;
  txHash: string;
  quoteTokenAmount: string;
  event: string;
}) {
  // setLpPrice
  let lpPriceParams = await getLpPriceParams({
    ctx,
    lpAddress,
    lpSymbol,
    lpPriceSymbol,
    block,
    txHash,
  });
  const lpTotalSupplyAmount = await getLpTotalSupplyAmount({ ctx });
  const lpPrice = calcLpPrice({
    totalSupply: lpTotalSupplyAmount.totalSupply,
    quoteTokenAmount: quoteTokenAmount,
  });
  lpPriceParams.event = event;
  lpPriceParams.lpPrice = lpPrice;
  await setLpPrice(ctx, lpPriceParams);
}
