import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { Repository } from "typeorm";
import * as pair from "../abi/PancakePair";
import { lpAddress, tvlAddressArr } from "../constants";
import { TVLChart } from "../model";
import { LpPrice } from "../model/generated/lpPrice.model";
import { setLpPrice, setTVLChart } from "../utils/setTVLChart";
import { ISqlTVLChart, ISqlTVLChartUtils } from "../utils/types";

export async function tvlMintLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();

    const item = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    // const alp_lp_index = item.lpAddress.indexOf(pairAddress);
    const lp_symbol = item.lpSymbol;

    // const lpAddressArr = Object.keys(tvlAddressArr);
    const mint = pair.events["Mint(address,uint256,uint256)"].decode(ctx);
    // console.log(mint, Number(mint.amount0), Number(mint.amount1), ctx.txHash);
    const mintBlockHeight = ctx.substrate.block.height;

    let amount0 = 1;
    let amount1 = 1;
    let price0 = 1;
    if (lp_symbol.indexOf("-USDC") > -1) {
      amount1 = Number(mint.amount1) / 1e6;
    } else {
      amount1 = Number(mint.amount1) / 1e18;
    }
    amount0 = Number(mint.amount0) / 1e18;
    price0 = amount1 / amount0;
    const price1 = 1;
    const lpPrice = amount0 * price0 + amount1 * price1;
    const price = ctx.store.getRepository(LpPrice);
    const priceLength = await price.count();
    await setLpPrice(ctx, {
      id: `${priceLength}`,
      lpPrice: `${lpPrice}`,
      lpAddress: item.lpAddress,
      block: ctx.substrate.block.height,
      event: "mint",
      txHash: ctx.txHash,
    });
    // const charts: Repository<TVLChart> = await ctx.store.getRepository(
    //   TVLChart
    // );
    // const chartArr: ISqlTVLChart[] = await charts.query(`
    //   select * from tvl_chart
    //   where block < ${mintBlockHeight}
    //   order by block
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
    console.log("Minr Error: ", e, ctx.txHash);
    // console.log(e);
  }
}
