import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { LpTotalSupplyAmount } from "../model";
interface ISqlLpTotalSupplyAmount {
  id: string;
  id_int: number;
  total_supply: string;
  from_address: string;
  to_address: string;
  block: number;
  tx_hash: string;
  lp_address: string;
  value: string;
  event: string;
}
interface ILpTotalSupplyAmount {
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
const ISqlLpTotalSupplyAmount = (
  params: ISqlLpTotalSupplyAmount
): ILpTotalSupplyAmount => {
  return {
    id: params.id,
    idInt: params.id_int,
    totalSupply: params.total_supply,
    fromAddress: params.from_address,
    toAddress: params.to_address,
    block: params.block,
    txHash: params.tx_hash,
    lpAddress: params.lp_address,
    value: params.value,
    event: params.event,
  };
};
export async function getLpTotalSupplyAmount({
  ctx,
  lpAddress,
}: {
  ctx: EvmLogHandlerContext;
  lpAddress: string;
}): Promise<ILpTotalSupplyAmount> {
  const store = ctx.store.getRepository(LpTotalSupplyAmount);
  const storeLen = await store.count();
  if (storeLen) {
    const storeArr: ISqlLpTotalSupplyAmount[] = await store.query(
      `
        SELECT * from lp_total_supply_amount
        where lp_address='${lpAddress}'
      `
    );
    if (storeArr && storeArr.length) {
      const lastStore = ISqlLpTotalSupplyAmount(storeArr[storeArr.length - 1]);
      return lastStore;
    }
  }
  return {
    // @ts-ignore
    ...LPTotalSupplyAmount[lpAddress],
    id: `${storeLen}`,
    idInt: storeLen,
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
    if (storeLen) {
      const storeArr: ISqlLpTotalSupplyAmount[] = await store.query(
        `
          SELECT * from lp_total_supply_amount
          where lp_address='${lpAddress}'
        `
      );
      if (storeArr && storeArr.length) {
        const lastStore = ISqlLpTotalSupplyAmount(
          storeArr[storeArr.length - 1]
        );
        return {
          ...lastStore,
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
    }
  }
  return {
    totalSupply: "",
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

export async function setLpTotalSupplyAmount(
  ctx: EvmLogHandlerContext,
  params: ILpTotalSupplyAmount
) {
  await ctx.store.save(new LpTotalSupplyAmount(params));
}
