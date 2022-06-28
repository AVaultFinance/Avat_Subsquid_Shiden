import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { Repository } from "typeorm";
import * as pair from "../abi/PancakePair";
import { tvlAddressArr } from "../constants";
import { TVLChart } from "../model";
import { LpPrice } from "../model/generated/lpPrice.model";
import { setTVLChart } from "../utils/setTVLChart";
import { ILpPrice, ISqlLpPrice, ITVLChart } from "../utils/types";

export async function tvlTransferLogsHandler(
  ctx: EvmLogHandlerContext,
  index: number
): Promise<void> {
  try {
    const txHash = ctx.txHash;
    const pairAddress = ctx.contractAddress.toLowerCase();
    const lpAddressArr = Object.keys(tvlAddressArr);
    if (pairAddress === lpAddressArr[index]) {
      const transfer =
        pair.events["Transfer(address,address,uint256)"].decode(ctx);
      const from = transfer.from.toLowerCase();
      const to = transfer.to.toLowerCase();
      const item = tvlAddressArr[pairAddress];
      const alp = item.aLpAddress;
      const provider = ethers.getDefaultProvider();
      const address = await provider.getCode(from);
      if (
        ((address === "0x" && to === alp) ||
          (address === alp && to === "0x")) &&
        from !== "0x0000000000000000000000000000000000000000" &&
        to !== "0x0000000000000000000000000000000000000000"
      ) {
        const value: BigNumber = transfer.value;
        const charts = ctx.store.getRepository(TVLChart);
        const chartsLength = await charts.count();
        const tvlvalue = Number(value) / 1e18;

        const chartValue: ITVLChart = {
          id: chartsLength.toString(),
          currentTimestamp: BigInt(ctx.substrate.block.timestamp),
          endTimestamp: BigInt(ctx.substrate.block.timestamp + 21600 * 1000),
          aLpAmount: tvlvalue,
          block: ctx.substrate.block.height,
          aLpAddress: pairAddress,
          txHash: txHash,
          lpPrice: item.lpAddress.map(() => "1"),
        };
        // time
        if (chartsLength) {
          const lastChart = await charts.find({
            id: (chartsLength - 1).toString(),
          });
          const diffTime =
            Number(lastChart[0].endTimestamp) -
            Number(ctx.substrate.block.timestamp);
          if (diffTime > 0) {
            chartValue.id = lastChart[0].id;
            chartValue.endTimestamp = BigInt(lastChart[0].endTimestamp);
          }
          if (address === "0x" && to === alp) {
            // in
            const newTvlValue =
              Number(tvlvalue) + Number(lastChart[0].aLpAmount);
            chartValue.aLpAmount = newTvlValue;
          } else if (address === alp && to === "0x") {
            // out
            const newTvlValue =
              Number(tvlvalue) - Number(lastChart[0].aLpAmount);
            chartValue.aLpAmount = newTvlValue;
          }
        }

        // get lp price
        const lpPriceStore: Repository<LpPrice> = await ctx.store.getRepository(
          LpPrice
        );
        const lpPriceStoreArr: ISqlLpPrice[] = await lpPriceStore.query(`
          select * from lp_price
          where block < ${ctx.substrate.block.height}
          order by block
        `);
        if (lpPriceStoreArr && lpPriceStoreArr.length) {
          item.lpAddress.map((vv: string, index: number) => {
            const lpPriceP = lpPriceStoreArr.filter(
              (v: ISqlLpPrice) => v.lp_address === vv
            );
            if (lpPriceP && lpPriceP.length) {
              chartValue.lpPrice[index] =
                lpPriceP[lpPriceP.length - 1].lp_price;
            }
          });
        }
        await setTVLChart(ctx, chartValue);
      }
    }
  } catch (e) {
    console.log("Transfer Error: ", e, ctx.txHash);
    // console.log(e);
  }
}
