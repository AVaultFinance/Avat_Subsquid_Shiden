import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import * as pair from "../abi/PancakePair";
import { aKSU, wSDN_USDC_LP } from "../constants";
import { TVLChart } from "../model";

export async function tvlIncLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  const tvlChartId = ctx.txHash;
  const pairAddress = ctx.contractAddress;
  if (pairAddress === wSDN_USDC_LP) {
    const transfer =
      pair.events["Transfer(address,address,uint256)"].decode(ctx);
    const from = transfer.from.toLowerCase();
    const to = transfer.to.toLowerCase();
    const value: BigNumber = transfer.value;
    const provider = ethers.getDefaultProvider();
    // user
    const address = await provider.getCode(from);
    // const result = await web3.eth.getCode(address);
    // sender from user and to is vault address
    // in
    if (address === "0x" && to === aKSU) {
      console.log(tvlChartId, transfer);
      const tvlvalue = value.toNumber();
      const charts = await ctx.store.getRepository(TVLChart);
      const chartsLength = await charts.count();
      if (chartsLength === 0) {
        await ctx.store.save(
          new TVLChart({
            id: chartsLength.toString(),
            currentTimestamp: BigInt(ctx.substrate.block.timestamp),
            endTimestamp: BigInt(ctx.substrate.block.timestamp + 21600 * 1000),
            value: tvlvalue,
          })
        );
      } else {
        const lastChart = await charts.find({
          id: (chartsLength - 1).toString(),
        });
        const newTvlValue = tvlvalue + lastChart[0].value;
        const diffTime =
          Number(lastChart[0].endTimestamp) -
          Number(ctx.substrate.block.timestamp);
        if (diffTime > 0) {
          await ctx.store.save(
            new TVLChart({
              id: lastChart[0].id,
              currentTimestamp: BigInt(ctx.substrate.block.timestamp),
              endTimestamp: BigInt(lastChart[0].endTimestamp),
              value: newTvlValue,
            })
          );
        } else {
          await ctx.store.save(
            new TVLChart({
              id: chartsLength.toString(),
              currentTimestamp: BigInt(ctx.substrate.block.timestamp),
              endTimestamp: BigInt(
                Number(ctx.substrate.block.timestamp) + 21600 * 1000
              ),
              value: newTvlValue,
            })
          );
        }
      }
    }
    // out
    if (address === aKSU && to === "0x") {
    }
  }
}
