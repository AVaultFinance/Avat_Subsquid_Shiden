export const CHAIN_NODE = "wss://shiden.api.onfinality.io/public-ws";
// export const wSDN-USDC LP =
//   "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase();
export const stable_symbol = "usdc";
export const address_zero =
  "0x0000000000000000000000000000000000000000".toLowerCase();

const tokens = {
  kac: {
    symbol: "kac",
    address: "0xb12c13e66AdE1F72f71834f2FC5082Db8C091358".toLowerCase(),
    decimals: 18,
  },
  sdn: {
    symbol: "sdn",
    address: "0x0f933Dc137D21cA519ae4C7E93f87a4C8EF365Ef".toLowerCase(),
    decimals: 18,
  },
  usdc: {
    symbol: "usdc",
    address: "0xfA9343C3897324496A05fC75abeD6bAC29f8A40f".toLowerCase(),
    decimals: 6,
  },
  eth: {
    symbol: "eth",
    address: "0x765277EebeCA2e31912C9946eAe1021199B39C61".toLowerCase(),
    decimals: 18,
  },
  busd: {
    symbol: "busd",
    address: "0x65e66a61D0a8F1e686C2D6083ad611a10D84D97A".toLowerCase(),
    decimals: 18,
  },
  jpyc: {
    symbol: "jpyc",
    address: "0x735aBE48e8782948a37C7765ECb76b98CdE97B0F".toLowerCase(),
    decimals: 18,
  },
};
const KAC_wSDN_lp = {
  lpSymbol: "KAC-wSDN LP".toLowerCase(),
  lpAddress: "0x456C0082DE0048EE883881fF61341177FA1FEF40".toLowerCase(),
  aLpAddress: "0x9A6080753a35dCd8e77102aE83A93170A831393e".toLowerCase(),
  token0Symbol: tokens.kac.symbol,
  token0Address: tokens.kac.address,
  token0Decimals: tokens.kac.decimals,
  token1Symbol: tokens.sdn.symbol,
  token1Address: tokens.sdn.address,
  token1Decimals: tokens.sdn.decimals,
};
const wSDN_USDC_lp = {
  lpSymbol: "wSDN-USDC LP".toLowerCase(),
  aLpAddress: "0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2".toLowerCase(),
  lpAddress: "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase(),
  token0Symbol: tokens.sdn.symbol,
  token0Address: tokens.sdn.address,
  token0Decimals: tokens.sdn.decimals,
  token1Symbol: tokens.usdc.symbol,
  token1Address: tokens.usdc.address,
  token1Decimals: tokens.usdc.decimals,
};
const ETH_wSDN_lp = {
  lpSymbol: "ETH-wSDN LP".toLowerCase(),
  aLpAddress: "0x0Aaf347F50b766cA85dB70f9e2B0E178E9a16F4D".toLowerCase(),
  lpAddress: "0xeb2C6d3F1bbe9DA50A0272E80fAA89354630DE88".toLowerCase(),
  token0Symbol: tokens.eth.symbol,
  token0Address: tokens.eth.address,
  token0Decimals: tokens.eth.decimals,
  token1Symbol: tokens.sdn.symbol,
  token1Address: tokens.sdn.address,
  token1Decimals: tokens.sdn.decimals,
};
const ETH_USDC_lp = {
  lpSymbol: "ETH-USDC LP".toLowerCase(),
  aLpAddress: "0xCA9b609b7a0Bc46CcF744B2e0261B9Afd14f81C0".toLowerCase(),
  lpAddress: "0xcfb0e95a3A68E3574C73a3C6985D56B7c03b6348".toLowerCase(),
  token0Symbol: tokens.eth.symbol,
  token0Address: tokens.eth.address,
  token0Decimals: tokens.eth.decimals,
  token1Symbol: tokens.usdc.symbol,
  token1Address: tokens.usdc.address,
  token1Decimals: tokens.usdc.decimals,
};
const BUSD_USDC_lp = {
  lpSymbol: "BUSD-USDC LP".toLowerCase(),
  aLpAddress: "0x8fcbe72710185dd34a8bBBA1Cc05eB2628945FEC".toLowerCase(),
  lpAddress: "0x8644e9AC84273cA0609F2A2B09b2ED2A5aD2e9DD".toLowerCase(),
  token0Symbol: tokens.busd.symbol,
  token0Address: tokens.busd.address,
  token0Decimals: tokens.busd.decimals,
  token1Symbol: tokens.usdc.symbol,
  token1Address: tokens.usdc.address,
  token1Decimals: tokens.usdc.decimals,
};
const wSDN_JPYC_lp = {
  lpSymbol: "wSDN-JPYC LP".toLowerCase(),
  aLpAddress: "0x5167E12139Ee4b2F6590F3C95E56B29d408a9048".toLowerCase(),
  lpAddress: "0x1Ba530cf929ea5bc7f1Af241495C97331Ddb4f70".toLowerCase(),
  token0Symbol: tokens.sdn.symbol,
  token0Address: tokens.sdn.address,
  token0Decimals: tokens.sdn.decimals,
  token1Symbol: tokens.jpyc.symbol,
  token1Address: tokens.jpyc.address,
  token1Decimals: tokens.jpyc.decimals,
};
const JPYC_USDC_lp = {
  lpSymbol: "JPYC-USDC LP".toLowerCase(),
  aLpAddress: "0x9d03BfE2e0BEDA103f1961A8595bF5d8b1F6FD18".toLowerCase(),
  lpAddress: "0xe2c19eb0f91c80275cc254f90ed0f18f26650ec5".toLowerCase(),
  token0Symbol: tokens.jpyc.symbol,
  token0Address: tokens.jpyc.address,
  token0Decimals: tokens.jpyc.decimals,
  token1Symbol: tokens.usdc.symbol,
  token1Address: tokens.usdc.address,
  token1Decimals: tokens.usdc.decimals,
};
export interface ITvlAddress {
  aLpAddress: string;
  lpAddress: string[];
}
// export const tvlAddressArr: Record<string, ITvlAddress> = {
//   // wSDN-USDC LP ----> aKSU
//   [wSDN_USDC_lp.lpAddress]: {
//     aLpAddress: wSDN_USDC_lp.aLpAddress,
//     lpAddress: [
//       wSDN_USDC_lp.lpAddress, // wSDN-USDC LP
//     ],
//   },
//   // // JPYC-USDC LP ----> aKJU
//   // [JPYC_USDC_lp.lpAddress]: {
//   //   aLpAddress: JPYC_USDC_lp.aLpAddress,
//   //   lpAddress: [
//   //     JPYC_USDC_lp.lpAddress, // JPYC-USDC LP
//   //   ],
//   // },
//   // // KAC-wSDN LP ----> aKKS
//   // [KAC_wSDN_lp.lpAddress]: {
//   //   aLpAddress: KAC_wSDN_lp.aLpAddress,
//   //   lpAddress: [
//   //     KAC_wSDN_lp.lpAddress, // KAC-wSDN LP
//   //     wSDN_USDC_lp.lpAddress, // wSDN-USDC LP
//   //   ],
//   // },

//   // ETH-wSDN LP ----> aKES
//   [ETH_wSDN_lp.lpAddress]: {
//     aLpAddress: ETH_wSDN_lp.aLpAddress,
//     lpAddress: [
//       ETH_wSDN_lp.lpAddress, // ETH-wSDN LP
//       wSDN_USDC_lp.lpAddress, // wSDN-USDC LP
//     ],
//   },

//   // ETH-USDC LP ----> aKEU
//   [ETH_USDC_lp.lpAddress]: {
//     aLpAddress: ETH_USDC_lp.aLpAddress,
//     lpAddress: [
//       ETH_USDC_lp.lpAddress, // ETH-USDC LP
//     ],
//   },

//   // // BUSD-USDC LP ----> aKBU
//   // [BUSD_USDC_lp.lpAddress]: {
//   //   aLpAddress: BUSD_USDC_lp.aLpAddress,
//   //   lpAddress: [
//   //     BUSD_USDC_lp.lpAddress, // BUSD-USDC LP
//   //   ],
//   // },

//   // // wSDN-JPYC LP ----> aKSJ
//   // [wSDN_JPYC_lp.lpAddress]: {
//   //   aLpAddress: wSDN_JPYC_lp.aLpAddress,
//   //   lpAddress: [
//   //     wSDN_JPYC_lp.lpAddress, // wSDN-JPYC LP
//   //     JPYC_USDC_lp.lpAddress, // JPYC-USDC LP
//   //   ],
//   // },
// };
// export const aKSU = "0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2".toLowerCase();

export const lpAddress = [
  wSDN_USDC_lp,
  ETH_USDC_lp,
  BUSD_USDC_lp,
  JPYC_USDC_lp,
  KAC_wSDN_lp,
  ETH_wSDN_lp,
  wSDN_JPYC_lp,
];
// lpTokenAmounts
// KAC-wSDN LP  Mint(token0,token1)  Mint(SDN, KAC)
// {
//   "block": 534888,
//   "event": "Mint",
//   "idInt": 0,
//   "lpAddress": "0x456c0082de0048ee883881ff61341177fa1fef40",
//   "token1": "sdn",
//   "token1Amount": "3.169999999999999929",
//   "token": "kac",
//   "txHash": "0x832bd572c27a487624539e4d585a239d7a06c22d92e446ddb58a98e4ca4a0e0c",
//   "tokenAmount": "1.000000000000000000"
// },
export type ILpType = typeof ETH_USDC_lp;
