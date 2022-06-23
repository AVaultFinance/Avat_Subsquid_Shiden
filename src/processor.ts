import {
  EvmLogHandlerContext,
  SubstrateEvmProcessor,
} from "@subsquid/substrate-evm-processor";
import { lookupArchive } from "@subsquid/archive-registry";
//import { CHAIN_NODE, contract, createContractEntity, getContractEntity, tvlChartLogsHandler } from "./contract";
import * as erc20 from "./abi/erc20";
import { events } from "./abi/uniswap-pair";
//import { Owner, Token, Transfer } from "./model";
//import { tvlChartIncLogsHandler, tvlChartDecLogsHandler, tvlChartIncLogsHandlerNew, tvlChartDecLogsHandlerNew,CHAIN_NODE } from "./contract";
//import { ORU_USDC_PAIR } from "./contract";
import {
  aKSU_Pool,
  SDN_USDC,
  contractLogsIncHandler,
  contractLogsDecHandler,
  CHAIN_NODE,
} from "./contract";

const processor = new SubstrateEvmProcessor("shiden-substrate");

processor.setBatchSize(500);

processor.setDataSource({
  chain: CHAIN_NODE,
  archive: lookupArchive("shiden")[0].url,
});

processor.setTypesBundle("shiden");

processor.setBlockRange({ from: 1366566 });

// processor.addPreHook({ range: { from: 1163314, to: 1165350 } }, async (ctx) => {
//   await ctx.store.save(createContractEntity());
// });

processor.addEvmLogHandler(
  SDN_USDC,
  {
    filter: [events["Transfer(address,address,uint256)"].topic],
    range: { from: 1366566 },
  },
  contractLogsIncHandler
);

processor.addEvmLogHandler(
  aKSU_Pool,
  {
    filter: [events["Transfer(address,address,uint256)"].topic],
    range: { from: 1366566 },
  },
  contractLogsDecHandler
);

processor.run();

// processor.addEvmLogHandler(
//   ORU_USDC_PAIR,
//   {
//     filter: [events["Mint(address,uint256,uint256)"].topic],
//     range: {from: 864889}
//   },
//   tvlChartIncLogsHandlerNew
// );
// processor.addEvmLogHandler(
//   ORU_USDC_PAIR,
//   {
//     filter: [events["Burn(address,uint256,uint256,address)"].topic],
//     range: {from: 864889}
//   },
//   tvlChartDecLogsHandlerNew
// );

// processor.addEvmLogHandler(
//   contract.address,
//   {
//     filter: [erc721.events["Transfer(address,address,uint256)"].topic],
//   },
//   contractLogsHandler
// );

// export async function contractLogsHandler(
//   ctx: EvmLogHandlerContext
// ): Promise<void> {
//   const transfer =
//     erc721.events["Transfer(address,address,uint256)"].decode(ctx);

//   let from = await ctx.store.get(Owner, transfer.from);
//   if (from == null) {
//     from = new Owner({ id: transfer.from, balance: 0n });
//     await ctx.store.save(from);
//   }

//   let to = await ctx.store.get(Owner, transfer.to);
//   if (to == null) {
//     to = new Owner({ id: transfer.to, balance: 0n });
//     await ctx.store.save(to);
//   }

//   let token = await ctx.store.get(Token, transfer.tokenId.toString());
//   if (token == null) {
//     token = new Token({
//       id: transfer.tokenId.toString(),
//       uri: await contract.tokenURI(transfer.tokenId),
//       contract: await getContractEntity(ctx),
//       owner: to,
//     });
//     await ctx.store.save(token);
//   } else {
//     token.owner = to;
//     await ctx.store.save(token);
//   }

//   await ctx.store.save(
//     new Transfer({
//       id: ctx.txHash,
//       token,
//       from,
//       to,
//       timestamp: BigInt(ctx.substrate.block.timestamp),
//       block: ctx.substrate.block.height,
//       transactionHash: ctx.txHash,
//     })
//   );
// }
