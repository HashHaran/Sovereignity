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

class Lit {
    litNodeClient;

    async connect() {
        console.log(client);
        await client.connect()
        this.litNodeClient = client
    }

    async encryptAndUploadFile(file, storage, onRootCidReady, onStoredChunk, REACT_APP_SOVEREIGNITY_MUMBAI, setTotalSizeOfEncryptedFile) {
        if (!this.litNodeClient) {
            console.log("Starting connection to lit");
            await this.connect()
        }
        console.log("Connection done");
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })
        console.log("Authorization via signing done");
        const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({ file });
        setTotalSizeOfEncryptedFile(encryptedFile.size);

        const files = [];
        files.push(new File([encryptedFile], "LitEncryptedSecret"));
        const contentId = await storage.put(files, { onRootCidReady, onStoredChunk });

        const accessControlConditionsSovereignity = [{
            contractAddress: REACT_APP_SOVEREIGNITY_MUMBAI,
            functionName: "isPermitted",
            functionParams: [ /*contentId, TODO: to be inserted dynamically*/ ":userAddress"],
            functionAbi: {
                "constant": true,
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
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            chain: chain,
            returnValueTest: {
                key: "",
                comparator: "=",
                value: "true",
            },
        }]

        let accessControlConditionsSovereignityWithCid = accessControlConditionsSovereignity;
        let functionParams = [contentId];
        accessControlConditionsSovereignityWithCid[0].functionParams = functionParams.concat(accessControlConditionsSovereignityWithCid[0].functionParams);

        const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
            evmContractConditions: accessControlConditionsSovereignityWithCid,
            symmetricKey,
            authSig,
            chain,
        })

        return {
            contentId: contentId,
            encryptedSymmetricKey: LitJsSdk.uint8arrayToString(encryptedSymmetricKey, "base16")
        }
    }

    async decryptFile(encryptedFile, encryptedSymmetricKey, contentId, REACT_APP_SOVEREIGNITY_MUMBAI) {
        if (!this.litNodeClient) {
            await this.connect()
        }
        const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain })

        const accessControlConditionsSovereignity = [{
            contractAddress: REACT_APP_SOVEREIGNITY_MUMBAI,
            functionName: "isPermitted",
            functionParams: [ /*contentId, TODO: to be inserted dynamically*/ ":userAddress"],
            functionAbi: {
                "constant": true,
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
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            chain: chain,
            returnValueTest: {
                key: "",
                comparator: "=",
                value: "true",
            },
        }]

        let accessControlConditionsSovereignityWithCid = accessControlConditionsSovereignity;
        let functionParams = [contentId];
        accessControlConditionsSovereignityWithCid[0].functionParams = functionParams.concat(accessControlConditionsSovereignityWithCid[0].functionParams);

        const symmetricKey = await this.litNodeClient.getEncryptionKey({
            evmContractConditions: accessControlConditionsSovereignityWithCid,
            toDecrypt: encryptedSymmetricKey,
            chain,
            authSig
        })
        const decryptedFile = await LitJsSdk.decryptFile(
            {
                file: encryptedFile,
                symmetricKey: symmetricKey
            }
        );
        // eslint-disable-next-line no-console
        console.log({
            decryptedFile
        })
        return decryptedFile;
    }
}

export default new Lit()