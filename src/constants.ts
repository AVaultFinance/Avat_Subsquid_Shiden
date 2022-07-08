export const CHAIN_NODE = "wss://shiden.api.onfinality.io/public-ws";
// export const wSDN-USDC LP =
//   "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase();
export const stable_symbol = "USDC";
export const address_zero =
  "0x0000000000000000000000000000000000000000".toLowerCase();
const KAC_wSDN_lp = {
  lpAddress: "0x456C0082DE0048EE883881fF61341177FA1FEF40".toLowerCase(),
  lpSymbol: "KAC-wSDN LP",
  aLpAddress: "0x9A6080753a35dCd8e77102aE83A93170A831393e".toLowerCase(),
};
const wSDN_USDC_lp = {
  lpAddress: "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase(),
  lpSymbol: "wSDN-USDC LP",
  aLpAddress: "0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2".toLowerCase(),
};
const ETH_wSDN_lp = {
  lpAddress: "0xeb2C6d3F1bbe9DA50A0272E80fAA89354630DE88".toLowerCase(),
  lpSymbol: "ETH-wSDN LP",
  aLpAddress: "0x0Aaf347F50b766cA85dB70f9e2B0E178E9a16F4D".toLowerCase(),
};
const ETH_USDC_lp = {
  lpAddress: "0xcfb0e95a3A68E3574C73a3C6985D56B7c03b6348".toLowerCase(),
  lpSymbol: "ETH-USDC LP",
  aLpAddress: "0xCA9b609b7a0Bc46CcF744B2e0261B9Afd14f81C0".toLowerCase(),
};
const BUSD_USDC_lp = {
  lpAddress: "0x8644e9AC84273cA0609F2A2B09b2ED2A5aD2e9DD".toLowerCase(),
  lpSymbol: "BUSD-USDC LP",
  aLpAddress: "0x8fcbe72710185dd34a8bBBA1Cc05eB2628945FEC".toLowerCase(),
};
const wSDN_JPYC_lp = {
  lpAddress: "0x1Ba530cf929ea5bc7f1Af241495C97331Ddb4f70".toLowerCase(),
  lpSymbol: "wSDN-JPYC LP",
  aLpAddress: "0x5167E12139Ee4b2F6590F3C95E56B29d408a9048".toLowerCase(),
};
const JPYC_USDC_lp = {
  lpAddress: "0xE2c19EB0f91c80275cc254f90Ed0f18F26650ec5".toLowerCase(),
  lpSymbol: "JPYC-USDC LP",
  aLpAddress: "0x9d03BfE2e0BEDA103f1961A8595bF5d8b1F6FD18".toLowerCase(),
};
export interface ITvlAddress {
  aLpAddress: string;
  lpAddress: string[];
}
export const tvlAddressArr: Record<string, ITvlAddress> = {
  // // wSDN-USDC LP ----> aKSU
  // [wSDN_USDC_lp.lpAddress]: {
  //   aLpAddress: wSDN_USDC_lp.aLpAddress,
  //   lpAddress: [
  //     wSDN_USDC_lp.lpAddress, // wSDN-USDC LP
  //   ],
  // },
  // // JPYC-USDC LP ----> aKJU
  // [JPYC_USDC_lp.lpAddress]: {
  //   aLpAddress: JPYC_USDC_lp.aLpAddress,
  //   lpAddress: [
  //     JPYC_USDC_lp.lpAddress, // JPYC-USDC LP
  //   ],
  // },
  // KAC-wSDN LP ----> aKKS
  [KAC_wSDN_lp.lpAddress]: {
    aLpAddress: KAC_wSDN_lp.aLpAddress,
    lpAddress: [
      KAC_wSDN_lp.lpAddress, // KAC-wSDN LP
      wSDN_USDC_lp.lpAddress, // wSDN-USDC LP
    ],
  },

  // // ETH-wSDN LP ----> aKES
  // [ETH_wSDN_lp.lpAddress]: {
  //   aLpAddress: ETH_wSDN_lp.aLpAddress,
  //   lpAddress: [
  //     ETH_wSDN_lp.lpAddress, // ETH-wSDN LP
  //     wSDN_USDC_lp.lpAddress, // wSDN-USDC LP
  //   ],
  // },

  // // ETH-USDC LP ----> aKEU
  // [ETH_USDC_lp.lpAddress]: {
  //   aLpAddress: ETH_USDC_lp.aLpAddress,
  //   lpAddress: [
  //     ETH_USDC_lp.lpAddress, // ETH-USDC LP
  //   ],
  // },

  // // BUSD-USDC LP ----> aKBU
  // [BUSD_USDC_lp.lpAddress]: {
  //   aLpAddress: BUSD_USDC_lp.aLpAddress,
  //   lpAddress: [
  //     BUSD_USDC_lp.lpAddress, // BUSD-USDC LP
  //   ],
  // },

  // // wSDN-JPYC LP ----> aKSJ
  // [wSDN_JPYC_lp.lpAddress]: {
  //   aLpAddress: wSDN_JPYC_lp.aLpAddress,
  //   lpAddress: [
  //     wSDN_JPYC_lp.lpAddress, // wSDN-JPYC LP
  //     JPYC_USDC_lp.lpAddress, // JPYC-USDC LP
  //   ],
  // },
};
// export const aKSU = "0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2".toLowerCase();

export const lpAddress = [
  {
    lpAddress: KAC_wSDN_lp.lpAddress,
    lpSymbol: KAC_wSDN_lp.lpSymbol,
  },
  {
    lpAddress: wSDN_USDC_lp.lpAddress,
    lpSymbol: wSDN_USDC_lp.lpSymbol,
  },
  {
    lpAddress: ETH_wSDN_lp.lpAddress,
    lpSymbol: ETH_wSDN_lp.lpSymbol,
  },
  {
    lpAddress: ETH_USDC_lp.lpAddress,
    lpSymbol: ETH_USDC_lp.lpSymbol,
  },
  {
    lpAddress: BUSD_USDC_lp.lpAddress,
    lpSymbol: BUSD_USDC_lp.lpSymbol,
  },
  {
    lpAddress: wSDN_JPYC_lp.lpAddress,
    lpSymbol: wSDN_JPYC_lp.lpSymbol,
  },
  {
    lpAddress: JPYC_USDC_lp.lpAddress,
    lpSymbol: JPYC_USDC_lp.lpSymbol,
  },
];
