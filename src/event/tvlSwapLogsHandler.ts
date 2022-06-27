import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { Repository } from "typeorm";
import * as pair from "../abi/PancakePair";
import { tvlAddressArr } from "../constants";
import { TVLChart } from "../model";
import { setTVLChartByLpPrice } from "../utils/setTVLChart";
export async function tvlSwapLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();
    const item = tvlAddressArr[pairAddress];
    const alp_lp_index = item.lpAddress.indexOf(pairAddress);
    const lp_symbol = item.lpAddressSymbol[alp_lp_index];
    const mint: pair.Swap0Event =
      pair.events[
        "Swap(address,uint256,uint256,uint256,uint256,address)"
      ].decode(ctx);
    // let obj: Record<string, any> = {};
    // for (let k in mint) {
    //   // @ts-ignore
    //   const value = mint[k];
    //   if (typeof value === "string") {
    //     obj[k] = value;
    //   } else {
    //     obj[k] = Number(value);
    //   }
    // }
    // console.log(obj, ctx.txHash);
    const mintBlockHeight = ctx.substrate.block.height;
    let amount0In = 1;
    let amount1In = 1;
    let price0 = 1;
    let price1 = 1;
    if (lp_symbol.indexOf("-USDC") > -1) {
      amount0In = Number(mint.amount0In) / 1e6;
      amount1In = Number(mint.amount1In) / 1e6;
    } else {
      amount0In = Number(mint.amount0In) / 1e18;
      amount1In = Number(mint.amount1In) / 1e18;
    }

    const amount0Out = Number(mint.amount0Out) / 1e18;
    const amount1Out = Number(mint.amount1Out) / 1e18;

    const amount0 = amount0In + amount1In;
    const amount1 = amount0Out + amount1Out;

    price0 = amount1 / amount0;
    price1 = 1;

    const lpPrice = amount0 * price0 + amount1 * price1;

    const charts: Repository<TVLChart> = await ctx.store.getRepository(
      TVLChart
    );
    const chartArr: any[] = await charts.query(`
        select * from tvl_chart
        where block < ${mintBlockHeight}
        order by block
      `);
    const chartsLength = chartArr.length;
    if (chartsLength) {
      const chart = chartArr[chartsLength - 1];
      const lpPriceArr = chart.lpPrice;
      if (item.lpAddressSymbol.length === 1) {
        lpPriceArr[0].price = lpPrice;
        await setTVLChartByLpPrice(ctx, chart, lpPriceArr);
      } else {
        lpPriceArr[alp_lp_index].price = lpPrice;
        await setTVLChartByLpPrice(ctx, chart, lpPriceArr);
      }
    }
  } catch (e) {
    console.log("error: ", e, ctx.txHash);
    // console.log(e);
  }
}
