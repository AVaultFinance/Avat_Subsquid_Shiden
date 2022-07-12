import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { LpTokenAmount } from "../model";
import LPTokenAmount from "./lpTokenAmount.json";
interface ILpTokenAmount {
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
interface ISqlLpTokenAmount {
  id: string;
  id_int: number;
  token: string;
  quote_token: string;
  token_amount: string;
  quote_token_amount: string;
  block: number;
  tx_hash: string;
  lp_address: string;
  event: string;
}
const ISqlTokenPriceUtils = (params: ISqlLpTokenAmount): ILpTokenAmount => {
  return {
    id: params.id,
    idInt: params.id_int,
    token: params.token,
    quoteToken: params.quote_token,
    tokenAmount: params.token_amount,
    quoteTokenAmount: params.quote_token_amount,
    block: params.block,
    txHash: params.tx_hash,
    lpAddress: params.lp_address,
    event: params.event,
  };
};
// export async function getLpTokenAmount({
//   ctx,
//   block,
// }: {
//   ctx: EvmLogHandlerContext;
//   block: number;
// }): Promise<ILpTokenAmount> {
//   const store = ctx.store.getRepository(LpTokenAmount);
//   const storeLen = await store.count();
//   if (storeLen) {
//     const lastStore = await store.find({
//       block: block,
//     });
//     return lastStore[0];
//   }
//   return {
//     id: "0",
//     idInt: 0,
//     token: "",
//     quoteToken: "",
//     tokenAmount: "",
//     quoteTokenAmount: "",
//     block: 0,
//     txHash: "",
//     lpAddress: "",
//     event: "",
//   };
// }

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
    const storeArr: ISqlLpTokenAmount[] = await store.query(
      `
        SELECT * from lp_token_amount
        where lp_address='${lpAddress}'
      `
    );
    if (storeArr && storeArr.length) {
      const lastStore = ISqlTokenPriceUtils(storeArr[storeArr.length - 1]);
      return {
        ...lastStore,
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
  }
  return {
    // @ts-ignore
    ...LPTokenAmount[lpAddress],
    id: `${storeLen}`,
    idInt: storeLen,
    token: token,
    quoteToken: quoteToken,
    block: block,
    txHash: txHash,
    lpAddress: lpAddress,
  };
}
export async function setLpTokenAmount(
  ctx: EvmLogHandlerContext,
  params: ILpTokenAmount
) {
  await ctx.store.save(new LpTokenAmount(params));
}
