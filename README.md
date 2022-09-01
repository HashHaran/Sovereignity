
# Sovereignity

A decentralized cloud storage facility where security is guaranted by EVM compatible blockchain smart contracts. The project leverages FIL/IPFS to provide users free storage. The project uses Solidity smart contracts and Lit protocol to guarantee the security of the files you upload.


## Motivation
IPFS and Filecoin together provide hot and cold storage facility to their users for ZERO cost as of today. Any content uploaded here is identified by its content ID a.k.a. CID. The drawback here being, as long as someone has the CID of the content I uploaded they can access it. This does not work in case of sensitive information. The project aims to  provide an access control protocol for files uploaded to IPFS/FIL so users can use it as a storage option even for sensitive data.
## Brief Documentation
![Flow Chart](https://bafkreihozsxmdryk4zyvuryydgsnbbqdifm2s26d2vavcxevwhg2jkl3xu.ipfs.w3s.link/?filename=Flowchart.png)

When an user uploads a file through the browser, the file is encrypted and stored in IPFS/FIL. The decryption key to this file is further encrypted and stored in data base. The decryption key required to decrypt the stored key is given to Lit Protocol. Someone who has access to the DB alone cannot decrypt the file as only the encrypted key is stored there. The decryption key from the Lit Protocol is required to decrypt this stored key first in order to decrypt the file uploaded to IPFS/FIL.

Lit Protocol works on the basis of threshold cryptography. When we give the decryption key to Lit Protocol it breaks the key into many pieces and gives each piece to one of the lit nodes. When we request for the decryption key back from Lit Protocol these lit nodes individually makes a RPC call to the smart contract and based on the value returned by this RPC call, the nodes will give the pieces of the key they hold. The smart contract address, the RPC call made and condition on the value returned are configured when giving the decryption key to Lit Protocol. The same condition has to be satisfied by the value returned by the smart contract.

As the RPC call is made to an EVM compatible smart contract, we can guarantee that the file uploaded by the user is secure. The file remains secure as long as the blockchain on which the smart contract is deployed doesn't fail and all lit nodes are not sabotaged.

## Deployments
| Blockchain | Contract Address |
| --- | ---------------- |
| Polygon Mumbai | 0xf6Cc81CDa01a1D933beAf1C66F7e567B4CDFE543 |

## Folder Structure

```
Sovereignity
|
|___blockchain: Contains smart contracts, unit tests, hardhat configurations and network RPC Url and Private key configurations
|
|___frontendv2: Contains the React frontend client, integrations with smart contract and integrations with web3.storage and Lit Protocol
|
|___the-graph: The Graph protocol implementation to index the smart contract and create entities for contents and content permissions
|
|___backend: NodeJs, Express and Mongo DB backend to store the encrypted key to be used when someone asks to download a file
```
## Tech Stack

**Frontend Client:** React, Material UI, web3.storage, LitJsSdk, Metamask, Apollo Graph QL

**Backend Server:** Mongo DB, Express, Node

**Blockchain:** Hardhat, Alchemy, Solidity, Chai

The Graph Protocol for smart contract indexing and querying
## Roadmap

- A more user friendly front end like google drive

- Make Lit Protocol integration through backend and not from browser

