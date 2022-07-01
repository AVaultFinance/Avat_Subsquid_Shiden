import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { LpTotalSupplyAmount } from "../model";
import { ILpTotalSupplyAmount } from "../utils/types";

export async function getLpTotalSupplyAmount({
  ctx,
}: {
  ctx: EvmLogHandlerContext;
}): Promise<ILpTotalSupplyAmount> {
  const store = ctx.store.getRepository(LpTotalSupplyAmount);
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
    totalSupply: "0",
    event: "",
    value: "0",
    block: 0,
    txHash: "",
    lpAddress: "",
    fromAddress: "",
    toAddress: "",
  };
}
export async function getLpTotalSupplyAmountParams({
  ctx,
  value,
  lpAddress,
  block,
  txHash,
  fromAddress,
  toAddress,
}: {
  ctx: EvmLogHandlerContext;
  value: string;
  lpAddress: string;
  block: number;
  txHash: string;
  fromAddress: string;
  toAddress: string;
}): Promise<ILpTotalSupplyAmount> {
  const store = ctx.store.getRepository(LpTotalSupplyAmount);
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
      value: value,
      block: block,
      txHash: txHash,
      lpAddress: lpAddress,
      fromAddress: fromAddress,
      toAddress: toAddress,
    };
  }
  return {
    id: "0",
    idInt: 0,
    totalSupply: "0",
    event: "",
    value: value,
    block: block,
    txHash: txHash,
    lpAddress: lpAddress,
    fromAddress: fromAddress,
    toAddress: toAddress,
  };
}

export async function setLpTotalSupplyAmount(
  ctx: EvmLogHandlerContext,
  params: ILpTotalSupplyAmount
) {
  await ctx.store.save(new LpTotalSupplyAmount(params));
}
