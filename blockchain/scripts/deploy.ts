import { ethers } from "hardhat";
var fs = require('fs');

//To keep the contract deployment address same always restart the blockchain before deploying, as the deployed contract address depends on the nonce
async function main() {
  const Sovereignity = await ethers.getContractFactory("Sovereignity");
  const sovereignity = await Sovereignity.deploy();

  await sovereignity.deployed();

  var sovereignityAddress = {
    contractAddress: sovereignity.address
  };
  var json = JSON.stringify(sovereignityAddress);
  const callback = () => {

  }

  fs.writeFile('contractAddress.json', json, 'utf8', callback);

  console.log("Sovereignity contract deployed to:", sovereignity.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
