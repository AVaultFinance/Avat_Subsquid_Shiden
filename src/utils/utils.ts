import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { tvlAddressArr } from "../constants";
import { setTVLChart } from "./setTVLChart";
import { ISqlTVLChart, ISqlTVLChartUtils } from "./types";

export async function setPrice(
  ctx: EvmLogHandlerContext,
  chartArr: ISqlTVLChart[],
  pairAddress: string,
  lpPrice: number
) {
  const chartsLength = chartArr.length;
  if (chartsLength) {
    const chart_params: ISqlTVLChart = chartArr[chartsLength - 1];
    const chart = ISqlTVLChartUtils(chart_params);
    const lpAddress = chart.aLpAddress;
    const item = tvlAddressArr[lpAddress];
    if (item) {
      const alp_lp_index = item.lpAddress.indexOf(pairAddress);
      if (alp_lp_index === 0 || alp_lp_index) {
        if (chart.lpPrice && chart.lpPrice && chart.lpPrice[alp_lp_index]) {
          chart.lpPrice[alp_lp_index] = `${lpPrice}`;
        } else {
          chart.lpPrice = item.lpAddress.map((v, index) =>
            index === alp_lp_index ? `${lpPrice}` : "1"
          );
        }
        await setTVLChart(ctx, chart);
      }
    }
  }
}
