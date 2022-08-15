import { ethers } from "hardhat";
import { Sovereignity } from "../typechain-types/Sovereignity"
var fs = require('fs');

//To keep the contract deployment address same always restart the blockchain before deploying, as the deployed contract address depends on the nonce
const contentId1 = "QmY7Yh4UquoXHLPFo2XbhXkhBvFoPwmQUSa92pxnxjQuPW";
async function main() {
    var sovereignityAddress: {
        contractAddress: string;
    };
    sovereignityAddress = { contractAddress: "PLACEHOLDER" };
    var data = fs.readFileSync('contractAddress.json', 'utf8')
    sovereignityAddress = JSON.parse(data);
    // console.log(sovereignityAddress);

    const Sovereignity = await ethers.getContractFactory("Sovereignity");
    const sovereignity: Sovereignity = Sovereignity.attach(sovereignityAddress.contractAddress);
    const tx = await sovereignity.addContent(contentId1);
    await tx.wait();
    console.log(await sovereignity.ownerOf(contentId1));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
