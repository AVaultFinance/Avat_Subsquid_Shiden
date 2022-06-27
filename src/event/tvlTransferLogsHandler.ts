import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import * as pair from "../abi/PancakePair";
import { tvlAddressArr } from "../constants";
import { LpPrice, TVLChart } from "../model";
import { setTVLChart } from "../utils/setTVLChart";
interface ITVLChart {
  id: string;
  currentTimestamp: bigint;
  endTimestamp: bigint;
  value: number;
  block: bigint;
}
export async function tvlTransferLogsHandler(
  ctx: EvmLogHandlerContext,
  index: number
): Promise<void> {
  try {
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
        // // get price
        // console.log({ mint });
        // // wSDN-USDC LP
        // // const sender = mint.sender;
        // const amount0 = Number(mint.amount0) / 1e6;
        // const amount1 = Number(mint.amount1) / 1e18;
        // const price0 = 1;
        // const price1 = amount0 / amount1;
        // const lpPrice = amount0 * price0 + amount1 * price1;
        // get price end ------
        const value: BigNumber = transfer.value;
        const charts = ctx.store.getRepository(TVLChart);
        const chartsLength = await charts.count();
        const tvlvalue = value.toNumber();
        let chartValue = {
          id: chartsLength.toString(),
          currentTimestamp: BigInt(ctx.substrate.block.timestamp),
          endTimestamp: BigInt(ctx.substrate.block.timestamp + 21600 * 1000),
          aLpAmount: tvlvalue,
          block: ctx.substrate.block.height,
          lpPrice: item.lpAddressSymbol.map(
            (v, index) =>
              new LpPrice({
                id: `${index}`,
                tokenSymbol: v,
                price: 1,
              })
          ),
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
        await setTVLChart(ctx, chartValue);
      }
    }
  } catch (e) {
    console.log("error: ", e, ctx.txHash);
    // console.log(e);
  }
}
