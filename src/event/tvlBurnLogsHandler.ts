import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { Repository } from "typeorm";
import * as pair from "../abi/PancakePair";
import { tvlAddressArr } from "../constants";
import { TVLChart } from "../model";
import { setTVLChartByLpPrice } from "../utils/setTVLChart";
interface ITVLChart {
  id: string;
  currentTimestamp: bigint;
  endTimestamp: bigint;
  value: number;
  block: bigint;
}
export async function tvlBurnLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();
    const item = tvlAddressArr[pairAddress];
    const alp_lp_index = item.lpAddress.indexOf(pairAddress);
    const lp_symbol = item.lpAddressSymbol[alp_lp_index];
    const mint =
      pair.events["Burn(address,uint256,uint256,address)"].decode(ctx);
    // console.log(mint, Number(mint.amount0), Number(mint.amount1), ctx.txHash);
    const mintBlockHeight = ctx.substrate.block.height;
    let amount0 = 1;
    let amount1 = 1;
    let price0 = 1;
    let price1 = 1;
    if (lp_symbol.indexOf("-USDC") > -1) {
      amount1 = Number(mint.amount1) / 1e6;
    } else {
      amount1 = Number(mint.amount1) / 1e18;
    }
    amount0 = Number(mint.amount0) / 1e18;
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
