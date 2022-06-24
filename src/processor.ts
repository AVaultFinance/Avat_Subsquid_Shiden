import {
  EvmLogHandlerContext,
  SubstrateEvmProcessor,
} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { events } from "./abi/PancakePair";
import { CHAIN_NODE, wSDN_USDC_LP } from "./constants";
import { tvlTransferLogsHandler } from "./event/tvlTransferLogsHandler";
import { tvlMintLogsHandler } from "./event/tvlMintLogsHandler";
import { tvlBurnLogsHandler } from "./event/tvlBurnLogsHandler";
import { tvlSwapLogsHandler } from "./event/tvlSwapLogsHandler";

const processor = new SubstrateEvmProcessor("shiden-avat");

processor.setBatchSize(500);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("shiden")[0].url,
});

processor.setTypesBundle("shiden");

interface IAddEvmDataItem {
  lpContract: string;
  range: { from: number; to: number };
  events: IEvent[];
}
interface IEvent {
  function: (ctx: EvmLogHandlerContext) => Promise<void>;
  key: string;
}
const addEvmData: IAddEvmDataItem[] = [
  {
    lpContract: wSDN_USDC_LP,
    // 1376841 from <= x < to
    range: { from: 1376841, to: 1376950 },
    events: [
      {
        key: "Transfer(address,address,uint256)",
        function: tvlTransferLogsHandler,
      },
      // {
      //   key: "Mint(address,uint256,uint256)",
      //   function: tvlMintLogsHandler,
      // },
      // {
      //   key: "Burn(address,uint256,uint256,address)",
      //   function: tvlBurnLogsHandler,
      // },
      // {
      //   key: "Swap(address,uint256,uint256,uint256,uint256,address)",
      //   function: tvlSwapLogsHandler,
      // },
    ],
  },
];
for (let i = 0; i < addEvmData.length; i++) {
  const item = addEvmData[i];
  for (let j = 0; j < item.events.length; j++) {
    const event = item.events[j];
    processor.addEvmLogHandler(
      item.lpContract, // 393
      {
        // @ts-ignore
        filter: [events[event.key].topic],
        // 1471437  1774944
        range: item.range,
      },
      event.function
    );
  }
}

// processor.addEvmLogHandler(
//   wSDN_USDC_LP,
//   {
//     filter: [events["Mint(address,uint256,uint256)"].topic],
//     range: { from: 1471437, to: 1774944 },
//   },
//   tvlIncLogsHandler
// );

// processor.addEvmLogHandler(
//   wSDN_USDC_LP,
//   {
//     filter: [events["Burn(address,uint256,uint256,address)"].topic],
//     range: { from: 1366566 },
//   },
//   tvlDecLogsHandler
// );

// processor.addEvmLogHandler(
//   wSDN_USDC_LP,
//   {
//     filter: [
//       events["Swap(address,uint256,uint256,uint256,uint256,address)"].topic,
//     ],
//     range: { from: 1366566 },
//   },
//   tvlDecLogsHandler
// );

processor.run();
