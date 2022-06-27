export const CHAIN_NODE = "wss://shiden.api.onfinality.io/public-ws";
// export const wSDN-USDC LP =
//   "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase();

export const tvlAddressArr = {
  // KAC-wSDN LP ----> aKKS
  ["0x456C0082DE0048EE883881fF61341177FA1FEF40".toLowerCase()]: {
    aLpAddress: "0x9A6080753a35dCd8e77102aE83A93170A831393e".toLowerCase(),
    range: { from: 1400053, to: 1401053 },
    lpAddress: [
      "0x456C0082DE0048EE883881fF61341177FA1FEF40".toLowerCase(), // KAC-wSDN LP
      "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase(), // wSDN-USDC LP
    ],
    lpAddressSymbol: ["KAC-wSDN LP", "wSDN-USDC LP"],
  },

  // wSDN-USDC LP ----> aKSU
  ["0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase()]: {
    aLpAddress: "0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2".toLowerCase(),
    range: { from: 1400053, to: 1401053 },
    lpAddress: [
      "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase(), // wSDN-USDC LP
    ],
    lpAddressSymbol: ["wSDN-USDC LP"],
  },

  // ETH-wSDN LP ----> aKES
  ["0xeb2C6d3F1bbe9DA50A0272E80fAA89354630DE88".toLowerCase()]: {
    aLpAddress: "0x0Aaf347F50b766cA85dB70f9e2B0E178E9a16F4D".toLowerCase(),
    range: { from: 1400053, to: 1401053 },
    lpAddress: [
      "0xeb2C6d3F1bbe9DA50A0272E80fAA89354630DE88".toLowerCase(), // ETH-wSDN LP
      "0xdB9a42E1165bA2fc479e1f2C1ce939807dbe6020".toLowerCase(), // wSDN-USDC LP
    ],
    lpAddressSymbol: ["ETH-wSDN LP", "wSDN-USDC LP"],
  },

  // ETH-USDC LP ----> aKEU
  ["0xcfb0e95a3A68E3574C73a3C6985D56B7c03b6348".toLowerCase()]: {
    aLpAddress: "0xCA9b609b7a0Bc46CcF744B2e0261B9Afd14f81C0".toLowerCase(),
    range: { from: 1400053, to: 1401053 },
    lpAddress: [
      "0xcfb0e95a3A68E3574C73a3C6985D56B7c03b6348".toLowerCase(), // ETH-USDC LP
    ],
    lpAddressSymbol: ["ETH-USDC LP"],
  },

  // BUSD-USDC LP ----> aKBU
  ["0x8644e9AC84273cA0609F2A2B09b2ED2A5aD2e9DD".toLowerCase()]: {
    aLpAddress: "0x8fcbe72710185dd34a8bBBA1Cc05eB2628945FEC".toLowerCase(),
    range: { from: 1400053, to: 1401053 },
    lpAddress: [
      "0x8644e9AC84273cA0609F2A2B09b2ED2A5aD2e9DD".toLowerCase(), // BUSD-USDC LP
    ],
    lpAddressSymbol: ["BUSD-USDC LP"],
  },

  // wSDN-JPYC LP ----> aKSJ
  ["0x1Ba530cf929ea5bc7f1Af241495C97331Ddb4f70".toLowerCase()]: {
    aLpAddress: "0x5167E12139Ee4b2F6590F3C95E56B29d408a9048".toLowerCase(),
    range: { from: 1400053, to: 1401053 },
    lpAddress: [
      "0x1Ba530cf929ea5bc7f1Af241495C97331Ddb4f70".toLowerCase(), // wSDN-JPYC LP
      "0xE2c19EB0f91c80275cc254f90Ed0f18F26650ec5".toLowerCase(), // JPYC-USDC LP
    ],
    lpAddressSymbol: ["wSDN-JPYC LP", "JPYC-USDC LP"],
  },

  // JPYC-USDC LP ----> aKJU
  ["0xE2c19EB0f91c80275cc254f90Ed0f18F26650ec5".toLowerCase()]: {
    aLpAddress: "0x9d03BfE2e0BEDA103f1961A8595bF5d8b1F6FD18".toLowerCase(),
    range: { from: 1400053, to: 1401053 },
    lpAddress: [
      "0xE2c19EB0f91c80275cc254f90Ed0f18F26650ec5".toLowerCase(), // JPYC-USDC LP
    ],
    lpAddressSymbol: ["JPYC-USDC LP"],
  },
};
// export const aKSU = "0xc5b8D0eC15984653A7554878eE9b4212EA059Fd2".toLowerCase();
