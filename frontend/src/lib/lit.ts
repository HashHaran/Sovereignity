import { Web3Storage } from "web3.storage";

var LitJsSdk = require("lit-js-sdk");

const client = new LitJsSdk.LitNodeClient()
const chain = 'mumbai'

/** 
 * Access control for a wallet with > 0.00001 ETH
 * const accessControlConditionsETHBalance = [
  {
    contractAddress: '',
    standardContractType: '',
    chain,
    method: 'eth_getBalance',
    parameters: [
      ':userAddress',
      'latest'
    ],
    returnValueTest: {
      comparator: '>=',
      value: '10000000000000'
    }
  }
]
 */

// Must hold at least one Monster Suit NFT (https://opensea.io/collection/monster-suit)
/*const accessControlConditionsNFT = [
    {
      contractAddress: '0xabdfb84dae7923dd346d5b1a0c6fbbb0e6e5df64',
      standardContractType: 'ERC721',
      chain,
      method: 'balanceOf',
      parameters: [
        ':userAddress'
      ],
      returnValueTest: {
        comparator: '>',
        value: '0'
      }
    }
  ]*/

const accessControlConditionsSovereignity = [{
    contractAddress: "0x5fbdb2315678afecb367f032d93f642f64180aa3",
    functionName: "isPermitted",
    functionParams: [ /*contentId, TODO: to be inserted dynamically*/ ":userAddress"],
    functionAbi: {
        "inputs": [{
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
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    chain: "ethereum",
    returnValueTest: {
        key: "",
        comparator: "=",
        value: "true",
    },
}]

class Lit {
    litNodeClient: any

    async connect() {
        console.log(client);
        await client.connect()
        this.litNodeClient = client
    }

    async encryptAndUploadFile(file: File, storage: Web3Storage) {
        if (!this.litNodeClient) {
            console.log("Starting connection to lit");
            await this.connect()
        }
        console.log("Connection done");
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        console.log("Authorization via signing done");
        const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file });

        const files = [];
        files.push(new File([encryptedFile], "LitEncryptedSecret"));
        const contentId: string = await storage.put(files);

        let accessControlConditionsSovereignityWithCid = accessControlConditionsSovereignity;
        let functionParams = [contentId];
        accessControlConditionsSovereignityWithCid[0].functionParams = functionParams.concat(accessControlConditionsSovereignityWithCid[0].functionParams);

        const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
            accessControlConditions: accessControlConditionsSovereignityWithCid,
            symmetricKey,
            authSig,
            chain,
        })

        return {
            contentId: contentId,
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
        }
    }

    async decryptFile(encryptedFile: any, encryptedSymmetricKey: any, contentId: string) {
        if (!this.litNodeClient) {
            await this.connect()
        }
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        let accessControlConditionsSovereignityWithCid = accessControlConditionsSovereignity;
        let functionParams = [contentId];
        accessControlConditionsSovereignityWithCid[0].functionParams = functionParams.concat(accessControlConditionsSovereignityWithCid[0].functionParams);

        const symmetricKey = await this.litNodeClient.getEncryptionKey({
            accessControlConditions: accessControlConditionsSovereignityWithCid,
            toDecrypt: encryptedSymmetricKey,
            chain,
            authSig
        })
        const decryptedFile = await LitJsSdk.decryptFile(
            encryptedFile,
            symmetricKey
        );
        // eslint-disable-next-line no-console
        console.log({
            decryptedFile
        })
        return { decryptedFile }
    }
}

export default new Lit()