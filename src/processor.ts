import {
  EvmLogHandlerContext,
  SubstrateEvmProcessor,
} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { events } from "./abi/PancakePair";
import { CHAIN_NODE, ILpType, lpAddress } from "./constants";
// import { tvlTransferChartLogsHandler } from "./event/tvlTransferChartLogsHandler";
import { tvlMintLogsHandler } from "./event/tvlMintLogsHandler";
import { tvlBurnLogsHandler } from "./event/tvlBurnLogsHandler";
import { tvlTransferLogsHandler } from "./event/tvlTransferLogsHandler";
import { tvlSwapLogsHandler } from "./event/tvlSwapLogsHandler";
import Web3 from "web3";

const processor = new SubstrateEvmProcessor("shiden-avat");
const web3 = new Web3("https://astar.api.onfinality.io/public"); //以太坊正式网络节点地址

processor.setBatchSize(500);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("shiden")[0].url,
});

processor.setTypesBundle("shiden");

interface IAddEvmDataItem {
  contract: string;
  events: IEvent[];
}
interface IEvent {
  function: (ctx: EvmLogHandlerContext, i: any) => Promise<void>;
  key: string;
}
// const lpAddressArr01 = Object.keys(tvlAddressArr);
// const lpAddressArr02 = [
//   ...new Set(lpAddressArr01.map((v) => tvlAddressArr[v].lpAddress).flat(2)),
// ];
// 534888   1554486
// const range = { from: 534888, to: 549370 };
// wSDN-USDC aLp 1366566
// 1366000
const range = { from: 1366731 };
// const addTransferEvmData: IAddEvmDataItem[] = lpAddressArr01.map(
//   (v: string) => {
//     return {
//       contract: v,
//       events: [
//         {
//           key: "Transfer(address,address,uint256)",
//           function: tvlTransferChartLogsHandler,
//         },
//       ],
//     };
//   }
// );
const addSwapEvmData: IAddEvmDataItem[] = lpAddress.map((v: ILpType) => {
  return {
    contract: v.lpAddress,
    events: [
      {
        key: "Transfer(address,address,uint256)",
        function: tvlTransferLogsHandler,
      },
      {
        key: "Mint(address,uint256,uint256)",
        function: tvlMintLogsHandler,
      },
      {
        key: "Burn(address,uint256,uint256,address)",
        function: tvlBurnLogsHandler,
      },
      {
        key: "Swap(address,uint256,uint256,uint256,uint256,address)",
        function: tvlSwapLogsHandler,
      },
    ],
  };
});
const evmArr = [...addSwapEvmData];
// const evmArr = [...addSwapEvmData, ...addTransferEvmData];
for (let i = 0; i < evmArr.length; i++) {
  const item = evmArr[i];
  for (let j = 0; j < item.events.length; j++) {
    const event = item.events[j];
    processor.addEvmLogHandler(
      item.contract,
      {
        filter: [
          // @ts-ignore
          events[event.key].topic,
        ],
        range: range,
      },
      async (ctx) => {
        await event.function(ctx, web3);
      }
    );
  }
}

processor.run();
