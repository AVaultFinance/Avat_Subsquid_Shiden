import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { Repository } from "typeorm";
import * as pair from "../abi/PancakePair";
import { lpAddress } from "../constants";
import { LpPrice } from "../model/generated/lpPrice.model";
import { setLpPrice } from "../utils/setTVLChart";
export async function tvlSwapLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();
    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = item.lpSymbol;
    const mint: pair.Swap0Event =
      pair.events[
        "Swap(address,uint256,uint256,uint256,uint256,address)"
      ].decode(ctx);
    const { amount0In, amount1In, amount0Out, amount1Out } = mint;

    const lpPriceStore = ctx.store.getRepository(LpPrice);
    const lpPriceStoreLength = await lpPriceStore.count();

    let totalSupply = 0;
    if (lpPriceStoreLength) {
      const lastLpPrice = await lpPriceStore.find({
        id: (lpPriceStoreLength - 1).toString(),
      });
      totalSupply = Number(lastLpPrice[0].totalSupply);
    }

    const price = ctx.store.getRepository(LpPrice);
    const priceLength = await price.count();

    await setLpPrice(ctx, {
      id: `${priceLength}`,
      lpPrice: `1`,
      lpAddress: item.lpAddress,
      block: ctx.substrate.block.height,
      event: "swap",
      txHash: ctx.txHash,
      totalSupply: `${totalSupply}`,
    });
    // const charts: Repository<TVLChart> = await ctx.store.getRepository(
    //   TVLChart
    // );
    // const chartArr: ISqlTVLChart[] = await charts.query(`
    //     select * from tvl_chart
    //     where block < ${mintBlockHeight}
    //     order by block
    //   `);
    // const chartsLength = chartArr.length;
    // if (chartsLength) {
    //   const chart_params: ISqlTVLChart = chartArr[chartsLength - 1];
    //   const chart = ISqlTVLChartUtils(chart_params);
    //   const lpAddress = chart.aLpAddress;
    //   const item = tvlAddressArr[lpAddress];
    //   if (item) {
    //     const alp_lp_index = item.lpAddress.indexOf(pairAddress);
    //     if (alp_lp_index === 0 || alp_lp_index) {
    //       if (chart.lpPrice && chart.lpPrice && chart.lpPrice[alp_lp_index]) {
    //         chart.lpPrice[alp_lp_index] = lpPrice;
    //       } else {
    //         chart.lpPrice = item.lpAddress.map((v, index) =>
    //           index === alp_lp_index ? lpPrice : 1
    //         );
    //       }
    //       await setTVLChart(ctx, chart);
    //     }
    //   }
    // }
  } catch (e) {
    console.log("Swap Error: ", e, ctx.txHash);
    // console.log(e);
  }
}
