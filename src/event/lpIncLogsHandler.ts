import { EvmLogHandlerContext } from "@subsquid/substrate-evm-processor";
import * as pair from "../abi/PancakePair";
import { aKSU, wSDN_USDC_LP } from "../constants";

export async function lpIncLogsHandler(
  ctx: EvmLogHandlerContext
): Promise<void> {
  const tvlChartId = ctx.txHash;
  const pairAddress = ctx.contractAddress;
  const mint = pair.events["Mint(address,uint256,uint256)"].decode(ctx);
  if (pairAddress === wSDN_USDC_LP) {
    const _sender = mint.sender.toLowerCase();
    const _amount0 = mint.amount0;
    const _amount1 = mint.amount0;
    if (_sender === aKSU) {
      console.log(1, mint);
      // console.log(2,mint);
      // console.log(3,mint);
    }
    // sender from av
  }
}
