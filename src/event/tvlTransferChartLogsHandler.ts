import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import * as pair from "../abi/PancakePair";
import { address_zero, tvlAddressArr } from "../constants";
import { TVLChart } from "../model";
import { setTVLChart } from "../utils/setTVLChart";
import { ITVLChart } from "../utils/types";

export async function tvlTransferChartLogsHandler(
  ctx: EvmLogHandlerContext,
  index: number
): Promise<void> {
  try {
    const txHash = ctx.txHash;
    const lpAddress = ctx.contractAddress.toLowerCase();
    const lpAddressArr = Object.keys(tvlAddressArr);
    if (lpAddress === lpAddressArr[index]) {
      const transfer =
        pair.events["Transfer(address,address,uint256)"].decode(ctx);
      const from = transfer.from.toLowerCase();
      const to = transfer.to.toLowerCase();
      const item = tvlAddressArr[lpAddress];
      const alp = item.aLpAddress;
      const provider = ethers.getDefaultProvider();
      const address = await provider.getCode(from);
      if (
        ((address === "0x" && to === alp) ||
          (address === alp && to === "0x")) &&
        from !== address_zero &&
        to !== address_zero
      ) {
        const value: BigNumber = transfer.value;
        const charts = ctx.store.getRepository(TVLChart);
        const chartsLength = await charts.count();
        const tvlvalue = Number(value) / 1e18;

        const chartValue: ITVLChart = {
          id: chartsLength.toString(),
          idInt: chartsLength,
          currentTimestamp: BigInt(ctx.substrate.block.timestamp),
          endTimestamp: BigInt(ctx.substrate.block.timestamp + 21600 * 1000),
          aLpAmount: tvlvalue,
          block: ctx.substrate.block.height,
          aLpAddress: lpAddress,
          txHash: txHash,
          lpPrice: item.lpAddress.map(() => "1"),
        };
        // time
        if (chartsLength) {
          const lastChart = await charts.find({
            idInt: chartsLength - 1,
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
        // const lpPriceStore: Repository<LpPrice> = await ctx.store.getRepository(
        //   LpPrice
        // );
        // const lpPriceStoreArr: ISqlLpPrice[] = await lpPriceStore.query(`
        //   select * from lp_price
        //   where block < ${ctx.substrate.block.height}
        //   order by block
        // `);
        // if (lpPriceStoreArr && lpPriceStoreArr.length) {
        //   item.lpAddress.map((vv: string, index: number) => {
        //     const lpPriceP = lpPriceStoreArr.filter(
        //       (v: ISqlLpPrice) => v.lp_address === vv
        //     );
        //     if (lpPriceP && lpPriceP.length) {
        //       chartValue.lpPrice[index] =
        //         lpPriceP[lpPriceP.length - 1].lp_price;
        //     }
        //   });
        // }

        // get last totalsupply

        await setTVLChart(ctx, chartValue);
      }
    }
  } catch (e) {
    console.log("Transfer Error: ", e, ctx.txHash);
    // console.log(e);
  }
}
