import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { LpTokenAmount } from "../model";
interface ILpTokenAmount {
  id: string;
  idInt: number;
  token0Symbol: string;
  token1Symbol: string;
  token0Amount: string;
  token1Amount: string;
  block: number;
  txHash: string;
  lpAddress: string;
  event: string;
}
// todo
interface ISqlLpTokenAmount {
  id: string;
  id_int: number;
  token0_symbol: string;
  token1_symbol: string;
  token0_amount: string;
  token1_amount: string;
  block: number;
  tx_hash: string;
  lp_address: string;
  event: string;
}
const ISqlTokenPriceUtils = (params: ISqlLpTokenAmount): ILpTokenAmount => {
  return {
    id: params.id,
    idInt: params.id_int,
    token0Symbol: params.token0_symbol,
    token1Symbol: params.token1_symbol,
    token0Amount: params.token0_amount,
    token1Amount: params.token1_amount,
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
//     token1: "",
//     tokenAmount: "",
//     token1Amount: "",
//     block: 0,
//     txHash: "",
//     lpAddress: "",
//     event: "",
//   };
// }

export async function getLpTokenAmountParams({
  ctx,
  token0Symbol,
  token1Symbol,
  block,
  txHash,
  lpAddress,
}: {
  ctx: EvmLogHandlerContext;
  token0Symbol: string;
  token1Symbol: string;
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
        token0Symbol: token0Symbol,
        token1Symbol: token1Symbol,
        block: block,
        txHash: txHash,
        lpAddress: lpAddress,
      };
    }
  }
  return {
    id: "0",
    idInt: 0,
    token0Amount: "0",
    token1Amount: "0",

    event: "",
    token0Symbol: token0Symbol,
    token1Symbol: token1Symbol,
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
