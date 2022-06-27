import {
  EvmLogHandlerContext,
  SubstrateEvmProcessor,
} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
import { events } from "./abi/PancakePair";
import { CHAIN_NODE, tvlAddressArr } from "./constants";
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
  contract: string;
  range: { from: number; to: number };
  events: IEvent[];
}
interface IEvent {
  function: (ctx: EvmLogHandlerContext, i: number) => Promise<void>;
  key: string;
}
const lpAddressArr01 = Object.keys(tvlAddressArr);
const lpAddressArr02 = [
  ...new Set(lpAddressArr01.map((v) => tvlAddressArr[v].lpAddress).flat(2)),
];
const addTransferEvmData: IAddEvmDataItem[] = lpAddressArr01.map(
  (v: string) => {
    return {
      contract: v,
      range: tvlAddressArr[v].range,
      events: [
        {
          key: "Transfer(address,address,uint256)",
          function: tvlTransferLogsHandler,
        },
      ],
    };
  }
);
const addSwapEvmData: IAddEvmDataItem[] = lpAddressArr02.map((v: string) => {
  return {
    contract: v,
    range: tvlAddressArr[v].range,
    events: [
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
const addEvmData = [...addTransferEvmData, ...addSwapEvmData];

for (let i = 0; i < addEvmData.length; i++) {
  const item = addEvmData[i];
  for (let j = 0; j < item.events.length; j++) {
    const event = item.events[j];
    processor.addEvmLogHandler(
      item.contract, // 393
      {
        // @ts-ignore
        filter: [events[event.key].topic],
        range: item.range,
      },
      async (ctx) => {
        await event.function(ctx, i);
      }
    );
  }
}

processor.run();
