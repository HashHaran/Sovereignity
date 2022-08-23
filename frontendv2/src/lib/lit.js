var LitJsSdk = require("lit-js-sdk");

const client = new LitJsSdk.LitNodeClient()
const chain = 'mumbai'

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