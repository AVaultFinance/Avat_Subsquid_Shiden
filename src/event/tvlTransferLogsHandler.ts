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
    const fromAddressCode = await provider.getCode(fromAddress);
    const toAddressCode = await provider.getCode(fromAddress);
    // alp transfer
    if (
      ((fromAddressCode === "0x" && toAddress === aLpAddress) ||
        (fromAddress === aLpAddress && toAddressCode === "0x")) &&
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
        aLpAmount: value.toFixed(18),
        aLpAmountUsd: (value * Number(lpPrice.lpPrice)).toFixed(18),
        block: ctx.substrate.block.height,
        aLpAddress: aLpAddress,
        txHash: txHash,
        lpPrice: lpPrice.lpPrice,
        totalALpAmountUsd: "0",
        event: "",
      };

      if (chartsLength) {
        const lastChart = await store.find({
          idInt: chartsLength - 1,
        });
        chartValue.totalALpAmountUsd = lastChart[0].totalALpAmountUsd;
      } else {
        chartValue.totalALpAmountUsd = chartValue.aLpAmountUsd;
      }

      if (storeArr && storeArr.length) {
        // const lastStore = ISqlTVLChartUtils(storeArr[storeArr.length - 1]);
        // const diffTime =
        //   Number(lastStore.endTimestamp) -
        //   Number(ctx.substrate.block.timestamp);
        // if (diffTime > 0) {
        //   chartValue.id = lastStore.id;
        //   chartValue.idInt = lastStore.idInt;
        //   chartValue.endTimestamp = BigInt(lastStore.endTimestamp);
        // }
        if (fromAddressCode === "0x" && toAddress === aLpAddress) {
          // in
          // const newTvlValue = value + Number(lastStore.aLpAmount);
          // chartValue.aLpAmount = newTvlValue.toFixed(18);
          // chartValue.aLpAmountUsd = (
          //   Number(chartValue.aLpAmount) * Number(lpPrice.lpPrice)
          // ).toFixed(18);
          chartValue.totalALpAmountUsd = (
            Number(chartValue.totalALpAmountUsd) +
            Number(chartValue.aLpAmountUsd)
          ).toFixed(18);
          chartValue.event = "in";
          await setTVLChart(ctx, chartValue);
        } else if (fromAddress === aLpAddress && toAddressCode === "0x") {
          // out
          // const newTvlValue = Number(lastStore.aLpAmount) - value;
          // chartValue.aLpAmount = newTvlValue.toFixed(18);
          // chartValue.aLpAmountUsd = (
          //   Number(chartValue.aLpAmount) * Number(lpPrice.lpPrice)
          // ).toFixed(18);
          chartValue.totalALpAmountUsd = (
            Number(chartValue.totalALpAmountUsd) -
            Number(chartValue.aLpAmountUsd)
          ).toFixed(18);
          chartValue.event = "out";
          await setTVLChart(ctx, chartValue);
        }
      } else {
        await setTVLChart(ctx, chartValue);
      }
    }
  } catch (e) {
    console.log("Transfer Error: ", e, ctx.txHash);
  }
}
