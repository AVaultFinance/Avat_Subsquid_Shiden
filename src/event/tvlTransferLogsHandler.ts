import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import { ethers } from "ethers";
import * as pair from "../abi/PancakePair";
import { address_zero, lpAddress } from "../constants";
import { TVLChart } from "../model";
import { getLpPrice, getLpPriceParams, ILpPrice } from "../store/lpPrice";
import {
  getLpTotalSupplyAmountParams,
  setLpTotalSupplyAmount,
} from "../store/lpTotalSupplyAmount";
import {
  ISqlTVLChart,
  ISqlTVLChartUtils,
  ITVLChart,
  setTVLChart,
} from "../store/tvlChart";

export async function tvlTransferLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  try {
    const pairAddress = ctx.contractAddress.toLowerCase();
    const block = ctx.substrate.block.height;
    const txHash = ctx.txHash;

    const itemLp = lpAddress.filter((v) => v.lpAddress === pairAddress)[0];
    const lp_symbol = itemLp.lpSymbol.toLowerCase();

    const mint = pair.events["Transfer(address,address,uint256)"].decode(ctx);
    const { from: _from, to: _to, value: _value } = mint;
    const fromAddress = _from.toLowerCase();
    const toAddress = _to.toLowerCase();
    const value = Number(_value) / Math.pow(10, 18);
    let lpTotalSupplyAmountParams = await getLpTotalSupplyAmountParams({
      ctx,
      value: `${value.toFixed(18)}`,
      lpAddress: pairAddress,
      block,
      txHash,
      fromAddress: fromAddress,
      toAddress: toAddress,
    });
    let lpPriceParams = await getLpPriceParams({
      ctx,
      lpAddress: pairAddress,
      lpSymbol: lp_symbol,
      block,
      txHash,
    });

    let len = lpTotalSupplyAmountParams.idInt;
    let lpTotalSupply = Number(lpTotalSupplyAmountParams.totalSupply);
    let event = "";

    if (fromAddress === address_zero) {
      lpTotalSupply = lpTotalSupply + value;
      lpTotalSupplyAmountParams.totalSupply = `${lpTotalSupply.toFixed(18)}`;

      if (event === "TransferBurn") {
        len = len + 1;
        lpTotalSupplyAmountParams.idInt = len;
        lpTotalSupplyAmountParams.id = `${len}`;
        lpPriceParams.idInt = len;
        lpPriceParams.id = `${len}`;
      }
      event = "TransferMint";
      lpPriceParams.event = "TransferMint";
      lpTotalSupplyAmountParams.event = event;
      await setLpTotalSupplyAmount(ctx, lpTotalSupplyAmountParams);
    }
    if (toAddress === address_zero && fromAddress === pairAddress) {
      lpTotalSupply = lpTotalSupply - value;
      lpTotalSupplyAmountParams.totalSupply = `${lpTotalSupply.toFixed(18)}`;
      if (event === "TransferMint") {
        len = len + 1;
        lpTotalSupplyAmountParams.idInt = len;
        lpTotalSupplyAmountParams.id = `${len}`;
        lpPriceParams.idInt = len;
        lpPriceParams.id = `${len}`;
      }
      event = "TransferBurn";
      lpPriceParams.event = "TransferBurn";
      lpTotalSupplyAmountParams.event = event;
      await setLpTotalSupplyAmount(ctx, lpTotalSupplyAmountParams);
    }

    // ---------------aLp function---------------
    const aLpAddress = itemLp.aLpAddress;
    const provider = ethers.getDefaultProvider();
    const address = await provider.getCode(fromAddress);
    // alp transfer
    if (
      ((address === "0x" && toAddress === aLpAddress) ||
        (address === aLpAddress && toAddress === "0x")) &&
      fromAddress !== address_zero &&
      toAddress !== address_zero
    ) {
      const store = ctx.store.getRepository(TVLChart);
      const chartsLength = await store.count();
      const storeArr: ISqlTVLChart[] = await store.query(
        `
          SELECT * from tvl_chart
          where a_lp_address='${aLpAddress}'
        `
      );
      const lpPrice: ILpPrice = await getLpPrice({
        ctx,
        lpSymbol: lp_symbol,
      });
      const chartValue: ITVLChart = {
        id: chartsLength.toString(),
        idInt: chartsLength,
        currentTimestamp: BigInt(ctx.substrate.block.timestamp),
        endTimestamp: BigInt(ctx.substrate.block.timestamp + 21600 * 1000),
        aLpAmount: value.toFixed(8),
        aLpAmountUsd: (value * Number(lpPrice.lpPrice)).toFixed(8),
        block: ctx.substrate.block.height,
        aLpAddress: aLpAddress,
        txHash: txHash,
        lpPrice: lpPrice.lpPrice,
        totalALpAmountUsd: "0",
      };

      if (chartsLength) {
        const lastChart = await store.find({
          idInt: chartsLength - 1,
        });
        chartValue.totalALpAmountUsd = lastChart[0].totalALpAmountUsd;
      }

      if (storeArr && storeArr.length) {
        const lastStore = ISqlTVLChartUtils(storeArr[storeArr.length - 1]);
        chartValue.totalALpAmountUsd = lastStore.totalALpAmountUsd;
        const diffTime =
          Number(lastStore.endTimestamp) -
          Number(ctx.substrate.block.timestamp);
        if (diffTime > 0) {
          chartValue.id = lastStore.id;
          chartValue.idInt = lastStore.idInt;
          chartValue.endTimestamp = BigInt(lastStore.endTimestamp);
        }
        if (address === "0x" && toAddress === aLpAddress) {
          // in
          const newTvlValue = value + Number(lastStore.aLpAmount);
          chartValue.aLpAmount = newTvlValue.toFixed(8);
          chartValue.aLpAmountUsd = (
            Number(chartValue.aLpAmount) * Number(lpPrice.lpPrice)
          ).toFixed(8);
          chartValue.totalALpAmountUsd = (
            Number(chartValue.totalALpAmountUsd) +
            Number(chartValue.aLpAmountUsd)
          ).toFixed(8);
        } else if (address === aLpAddress && toAddress === "0x") {
          // out
          const newTvlValue = value - Number(lastStore.aLpAmount);
          chartValue.aLpAmount = newTvlValue.toFixed(8);
          chartValue.aLpAmountUsd = (
            Number(chartValue.aLpAmount) * Number(lpPrice.lpPrice)
          ).toFixed(8);
          chartValue.totalALpAmountUsd = (
            Number(chartValue.totalALpAmountUsd) -
            Number(chartValue.aLpAmountUsd)
          ).toFixed(8);
        }
      }

      await setTVLChart(ctx, chartValue);
    }
  } catch (e) {
    console.log("Transfer Error: ", e, ctx.txHash);
  }
}
