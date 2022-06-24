import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { BigNumber, ethers } from "ethers";
import { getContractAddress } from "ethers/lib/utils";
import * as pair from "../abi/PancakePair";
import { aKSU, wSDN_USDC_LP } from "../constants";
import { TVLChart } from "../model";

export async function tvlIncLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    // const mint = pair.events["Mint(address,uint256,uint256)"].decode(ctx);
    const pairAddress = ctx.contractAddress;
    if (pairAddress === wSDN_USDC_LP) {
      const transfer =
        pair.events["Transfer(address,address,uint256)"].decode(ctx);
      const from = transfer.from.toLowerCase();
      const to = transfer.to.toLowerCase();

      // const result = await web3.eth.getCode(address);
      // sender from user and to is vault address
      if (
        (to === aKSU || from === aKSU) &&
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
        const lpPrice = 1;
        // get price end ------
        const value: BigNumber = transfer.value;
        const charts = await ctx.store.getRepository(TVLChart);
        const chartsLength = await charts.count();
        const provider = ethers.getDefaultProvider();
        const address = await provider.getCode(from);
        const tvlvalue = value.toNumber();

        let chartValue = {
          id: chartsLength.toString(),
          currentTimestamp: BigInt(ctx.substrate.block.timestamp),
          endTimestamp: BigInt(ctx.substrate.block.timestamp + 21600 * 1000),
          value: tvlvalue,
        };
        const lastChart = await charts.find({
          id: (chartsLength - 1).toString(),
        });
        // time
        if (chartsLength) {
          const diffTime =
            Number(lastChart[0].endTimestamp) -
            Number(ctx.substrate.block.timestamp);
          if (diffTime > 0) {
            chartValue.id = lastChart[0].id;
            chartValue.endTimestamp = BigInt(lastChart[0].endTimestamp);
          }
          // in
          if (address === "0x" && to === aKSU) {
            const newTvlValue = Number(tvlvalue) + Number(lastChart[0].value);
            chartValue.value = newTvlValue;
          } else if (address === aKSU && to === "0x") {
            // out
            const newTvlValue = Number(tvlvalue) - Number(lastChart[0].value);
            chartValue.value = newTvlValue;
          }
        }
        console.log({ chartValue });
        await ctx.store.save(
          new TVLChart({
            id: chartValue.id,
            currentTimestamp: chartValue.currentTimestamp,
            endTimestamp: chartValue.endTimestamp,
            value: Number((chartValue.value * lpPrice).toFixed(2)),
          })
        );
      }
    }
  } catch (e) {
    console.log(ctx.txHash);
    // console.log(e);
  }
}