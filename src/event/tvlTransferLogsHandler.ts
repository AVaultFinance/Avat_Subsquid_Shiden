import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import * as pair from "../abi/PancakePair";
import { aKSU, wSDN_USDC_LP } from "../constants";
import { TVLChart } from "../model";
interface ITVLChart {
  id: string;
  currentTimestamp: bigint;
  endTimestamp: bigint;
  value: number;
  block: bigint;
}
export async function tvlTransferLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  console.log(ctx.substrate.block.height);
  try {
    const pairAddress = ctx.contractAddress;
    if (pairAddress === wSDN_USDC_LP) {
      const transfer =
        pair.events["Transfer(address,address,uint256)"].decode(ctx);
      const from = transfer.from.toLowerCase();
      const to = transfer.to.toLowerCase();

      const provider = ethers.getDefaultProvider();
      const address = await provider.getCode(from);
      if (
        ((address === "0x" && to === aKSU) ||
          (address === aKSU && to === "0x")) &&
        from !== "0x0000000000000000000000000000000000000000" &&
        to !== "0x0000000000000000000000000000000000000000"
      ) {
        console.log(111);
        // // get price
        // console.log({ mint });
        // // wSDN-USDC LP
        // // const sender = mint.sender;
        // const amount0 = Number(mint.amount0) / 1e6;
        // const amount1 = Number(mint.amount1) / 1e18;
        // const price0 = 1;
        // const price1 = amount0 / amount1;
        // const lpPrice = amount0 * price0 + amount1 * price1;
        const lpPrice = 1;
        // get price end ------
        const value: BigNumber = transfer.value;
        const charts = ctx.store.getRepository(TVLChart);
        const chartsLength = await charts.count();
        const tvlvalue = value.toNumber();
        let chartValue = {
          id: chartsLength.toString(),
          currentTimestamp: BigInt(ctx.substrate.block.timestamp),
          endTimestamp: BigInt(ctx.substrate.block.timestamp + 21600 * 1000),
          value: tvlvalue,
          block: BigInt(ctx.substrate.block.height),
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
          if (address === "0x" && to === aKSU) {
            // in
            const newTvlValue = Number(tvlvalue) + Number(lastChart[0].value);
            chartValue.value = newTvlValue;
          } else if (address === aKSU && to === "0x") {
            // out
            const newTvlValue = Number(tvlvalue) - Number(lastChart[0].value);
            chartValue.value = newTvlValue;
          }
        }
        await setTVLChart(ctx, chartValue, lpPrice);
      }
    }
  } catch (e) {
    console.log("error: ", e, ctx.txHash);
    // console.log(e);
  }
}

async function setTVLChart(
  ctx: EvmLogHandlerContext,
  chartValue: ITVLChart,
  lpPrice: number
) {
  await ctx.store.save(
    new TVLChart({
      id: chartValue.id,
      currentTimestamp: chartValue.currentTimestamp,
      endTimestamp: chartValue.endTimestamp,
      value: Number((chartValue.value * lpPrice).toFixed(2)),
      block: chartValue.block,
    })
  );
}
