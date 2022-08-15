import lit from "../lib/lit";
import { ethers } from "ethers";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import * as dotenv from "dotenv";
dotenv.config();
console.log(process.env);

const REACT_APP_WEB3_STORAGE_API_KEY = process.env.REACT_APP_WEB3_STORAGE_API_KEY;
if (!REACT_APP_WEB3_STORAGE_API_KEY) {
  throw new Error("Please set your WEB3_STORAGE_API_KEY in a .env file");
}
const storage = new Web3Storage({ token: REACT_APP_WEB3_STORAGE_API_KEY });

//1) The client is supposed to read the file, add it to smartcontract, get it encrypted with LIT and store it locally
//2) The client is supposed to read the file, add it to smartcontract, get it encrypted with LIT and store it in IPFS/FIL
//3) The client is supposed to read the file, add it to smartcontract, get it encrypted with LIT, store it in IPFS/FIL and giver permission to the user
//3) The client is supposed to read the file, add it to smartcontract, get it encrypted with LIT, store it in IPFS/FIL, giver permission to the user and send him a notification with CID via XMTP
const contractAddress = "0x174f09E67a34C9d712D0b0436eAbFd249A6191f3";
const sovereignityAbi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timeStamp",
        "type": "uint256"
      }
    ],
    "name": "ContentCreation",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timeStamp",
        "type": "uint256"
      }
    ],
    "name": "ContentDeletion",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timeStamp",
        "type": "uint256"
      }
    ],
    "name": "OwnershipTransfered",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timeStamp",
        "type": "uint256"
      }
    ],
    "name": "PermissionGranted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "user",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timeStamp",
        "type": "uint256"
      }
    ],
    "name": "PermissionRevoked",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      }
    ],
    "name": "addContent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "awardPermission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "internalType": "address[]",
        "name": "permUsers",
        "type": "address[]"
      }
    ],
    "name": "deleteContent",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "isPermitted",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "user",
        "type": "address"
      }
    ],
    "name": "revokePermission",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentId",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "newOwner",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "permUsers",
        "type": "address[]"
      }
    ],
    "name": "transferOwnership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default async function handleUpload(provider, topSecret) {
  var { contentId, encryptedSymmetricKey } = await lit.encryptAndUploadFile(topSecret, storage);
  console.log(encryptedSymmetricKey);  //TODO: store this somewhere to decrypt when user tries to retreive the file

  const sovereignity = new ethers.Contract(contractAddress, sovereignityAbi, provider).connect(provider.getSigner());

  await sovereignity.addContent(contentId);
}
