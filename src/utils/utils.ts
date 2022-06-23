import { BigNumber } from "ethers";

export function convertTokenToDecimal(
  amount: BigNumber,
  decimals: bigint
): number {
  let divider = 1n;
  for (let i = 0; i < decimals; i++) {
    divider *= 10n;
  }
  return amount.div(divider).toNumber();
}
