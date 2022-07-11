import { stable_symbol } from "../constants";
export function getDecimal(tokenSymbol: string) {
  return tokenSymbol.indexOf(stable_symbol) > -1 ? 6 : 18;
}
export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// export async function setPrice(
//   ctx: EvmLogHandlerContext,
//   chartArr: ISqlTVLChart[],
//   lpAddress: string,
//   lpPrice: number
// ) {
//   const chartsLength = chartArr.length;
//   if (chartsLength) {
//     const chart_params: ISqlTVLChart = chartArr[chartsLength - 1];
//     const chart = ISqlTVLChartUtils(chart_params);
//     const lpAddress = chart.aLpAddress;
//     const item = tvlAddressArr[lpAddress];
//     if (item) {
//       const alp_lp_index = item.lpAddress.indexOf(lpAddress);
//       if (alp_lp_index === 0 || alp_lp_index) {
//         if (chart.lpPrice && chart.lpPrice && chart.lpPrice[alp_lp_index]) {
//           chart.lpPrice[alp_lp_index] = `${lpPrice}`;
//         } else {
//           chart.lpPrice = item.lpAddress.map((v, index) =>
//             index === alp_lp_index ? `${lpPrice}` : "1"
//           );
//         }
//         await setTVLChart(ctx, chart);
//       }
//     }
//   }
// }

export function symbolFormat(params: string) {
  return params.toLowerCase() === "wastr"
    ? "astr"
    : params.toLowerCase() === "weth"
    ? "eth"
    : params.toLowerCase() === "wsdn"
    ? "sdn"
    : params.toLowerCase() === "wbtc"
    ? "btc"
    : params.toLowerCase();
}
