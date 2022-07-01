import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { LpTokenAmount } from "../model";
import { ILpTokenAmount } from "../utils/types";

export async function getLpTokenAmount({
  ctx,
}: {
  ctx: EvmLogHandlerContext;
}): Promise<ILpTokenAmount> {
  const store = ctx.store.getRepository(LpTokenAmount);
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
    token: "",
    quoteToken: "",
    tokenAmount: "",
    quoteTokenAmount: "",
    block: 0,
    txHash: "",
    lpAddress: "",
    event: "",
  };
}

export async function getLpTokenAmountParams({
  ctx,
  token,
  quoteToken,
  block,
  txHash,
  lpAddress,
}: {
  ctx: EvmLogHandlerContext;
  token: string;
  quoteToken: string;
  block: number;
  txHash: string;
  lpAddress: string;
}): Promise<ILpTokenAmount> {
  const store = ctx.store.getRepository(LpTokenAmount);
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
      token: token,
      quoteToken: quoteToken,
      block: block,
      txHash: txHash,
      lpAddress: lpAddress,
    };
  }
  return {
    id: "0",
    idInt: 0,
    tokenAmount: "0",
    quoteTokenAmount: "0",

    event: "",
    token: token,
    quoteToken: quoteToken,
    block: block,
    txHash: txHash,
    lpAddress: lpAddress,
  };
}
