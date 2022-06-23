import * as ethers from "ethers";

export const abi = new ethers.utils.Interface(getJsonAbi());

export interface IssueUint256Event {
  amount: ethers.BigNumber;
}

export interface RedeemUint256Event {
  amount: ethers.BigNumber;
}

export interface DeprecateAddressEvent {
  newAddress: string;
}

export interface ParamsUint256Uint256Event {
  feeBasisPoints: ethers.BigNumber;
  maxFee: ethers.BigNumber;
}

export interface DestroyedBlackFundsAddressUint256Event {
  _blackListedUser: string;
  _balance: ethers.BigNumber;
}

export interface AddedBlackListAddressEvent {
  _user: string;
}

export interface RemovedBlackListAddressEvent {
  _user: string;
}

export interface ApprovalAddressAddressUint256Event {
  owner: string;
  spender: string;
  value: ethers.BigNumber;
}

export interface TransferAddressAddressUint256Event {
  from: string;
  to: string;
  value: ethers.BigNumber;
}

export interface PauseEvent {
}

export interface UnpauseEvent {
}

export interface EvmEvent {
  data: string;
  topics: string[];
}

export const events = {
  "Issue(uint256)":  {
    topic: abi.getEventTopic("Issue(uint256)"),
    decode(data: EvmEvent): IssueUint256Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Issue(uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        amount: result[0],
      }
    }
  }
  ,
  "Redeem(uint256)":  {
    topic: abi.getEventTopic("Redeem(uint256)"),
    decode(data: EvmEvent): RedeemUint256Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Redeem(uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        amount: result[0],
      }
    }
  }
  ,
  "Deprecate(address)":  {
    topic: abi.getEventTopic("Deprecate(address)"),
    decode(data: EvmEvent): DeprecateAddressEvent {
      const result = abi.decodeEventLog(
        abi.getEvent("Deprecate(address)"),
        data.data || "",
        data.topics
      );
      return  {
        newAddress: result[0],
      }
    }
  }
  ,
  "Params(uint256,uint256)":  {
    topic: abi.getEventTopic("Params(uint256,uint256)"),
    decode(data: EvmEvent): ParamsUint256Uint256Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Params(uint256,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        feeBasisPoints: result[0],
        maxFee: result[1],
      }
    }
  }
  ,
  "DestroyedBlackFunds(address,uint256)":  {
    topic: abi.getEventTopic("DestroyedBlackFunds(address,uint256)"),
    decode(data: EvmEvent): DestroyedBlackFundsAddressUint256Event {
      const result = abi.decodeEventLog(
        abi.getEvent("DestroyedBlackFunds(address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        _blackListedUser: result[0],
        _balance: result[1],
      }
    }
  }
  ,
  "AddedBlackList(address)":  {
    topic: abi.getEventTopic("AddedBlackList(address)"),
    decode(data: EvmEvent): AddedBlackListAddressEvent {
      const result = abi.decodeEventLog(
        abi.getEvent("AddedBlackList(address)"),
        data.data || "",
        data.topics
      );
      return  {
        _user: result[0],
      }
    }
  }
  ,
  "RemovedBlackList(address)":  {
    topic: abi.getEventTopic("RemovedBlackList(address)"),
    decode(data: EvmEvent): RemovedBlackListAddressEvent {
      const result = abi.decodeEventLog(
        abi.getEvent("RemovedBlackList(address)"),
        data.data || "",
        data.topics
      );
      return  {
        _user: result[0],
      }
    }
  }
  ,
  "Approval(address,address,uint256)":  {
    topic: abi.getEventTopic("Approval(address,address,uint256)"),
    decode(data: EvmEvent): ApprovalAddressAddressUint256Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Approval(address,address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        owner: result[0],
        spender: result[1],
        value: result[2],
      }
    }
  }
  ,
  "Transfer(address,address,uint256)":  {
    topic: abi.getEventTopic("Transfer(address,address,uint256)"),
    decode(data: EvmEvent): TransferAddressAddressUint256Event {
      const result = abi.decodeEventLog(
        abi.getEvent("Transfer(address,address,uint256)"),
        data.data || "",
        data.topics
      );
      return  {
        from: result[0],
        to: result[1],
        value: result[2],
      }
    }
  }
  ,
  "Pause()":  {
    topic: abi.getEventTopic("Pause()"),
    decode(data: EvmEvent): PauseEvent {
      const result = abi.decodeEventLog(
        abi.getEvent("Pause()"),
        data.data || "",
        data.topics
      );
      return  {
      }
    }
  }
  ,
  "Unpause()":  {
    topic: abi.getEventTopic("Unpause()"),
    decode(data: EvmEvent): UnpauseEvent {
      const result = abi.decodeEventLog(
        abi.getEvent("Unpause()"),
        data.data || "",
        data.topics
      );
      return  {
      }
    }
  }
  ,
}

function getJsonAbi(): any {
  return [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_upgradedAddress",
          "type": "address"
        }
      ],
      "name": "deprecate",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "deprecated",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_evilUser",
          "type": "address"
        }
      ],
      "name": "addBlackList",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "upgradedAddress",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "balances",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "maximumFee",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "_totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "unpause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_maker",
          "type": "address"
        }
      ],
      "name": "getBlackListStatus",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        },
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "allowed",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "paused",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "who",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [],
      "name": "pause",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getOwner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newBasisPoints",
          "type": "uint256"
        },
        {
          "name": "newMaxFee",
          "type": "uint256"
        }
      ],
      "name": "setParams",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "issue",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "redeem",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "remaining",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "basisPointsRate",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "isBlackListed",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_clearedUser",
          "type": "address"
        }
      ],
      "name": "removeBlackList",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "MAX_UINT",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_blackListedUser",
          "type": "address"
        }
      ],
      "name": "destroyBlackFunds",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_initialSupply",
          "type": "uint256"
        },
        {
          "name": "_name",
          "type": "string"
        },
        {
          "name": "_symbol",
          "type": "string"
        },
        {
          "name": "_decimals",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Issue",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "Redeem",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "newAddress",
          "type": "address"
        }
      ],
      "name": "Deprecate",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "feeBasisPoints",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "maxFee",
          "type": "uint256"
        }
      ],
      "name": "Params",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_blackListedUser",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "_balance",
          "type": "uint256"
        }
      ],
      "name": "DestroyedBlackFunds",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "AddedBlackList",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "_user",
          "type": "address"
        }
      ],
      "name": "RemovedBlackList",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "Pause",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [],
      "name": "Unpause",
      "type": "event"
    }
  ]
}
