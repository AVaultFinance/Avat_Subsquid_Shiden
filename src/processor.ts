import { SubstrateEvmProcessor } from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { events } from "./abi/PancakePair";
import { CHAIN_NODE, wSDN_USDC_LP } from "./constants";
import { tvlIncLogsHandler } from "./event/tvlIncLogsHandler";
import { tvlDecLogsHandler } from "./event/tvlDecLogsHandler";

const processor = new SubstrateEvmProcessor("shiden-avat");

processor.setBatchSize(500);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("shiden")[0].url,
});

processor.setTypesBundle("shiden");

processor.addEvmLogHandler(
  wSDN_USDC_LP,
  {
    filter: [events["Transfer(address,address,uint256)"].topic],
    range: { from: 1471437, to: 1733149 },
  },
  tvlIncLogsHandler
);

// processor.addEvmLogHandler(
//   wSDN_USDC_LP,
//   {
//     filter: [events["Mint(address,uint256,uint256)"].topic],
//     range: { from: 1471437, to: 1733149 },
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
