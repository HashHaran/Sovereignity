import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@nomiclabs/hardhat-ethers'
import '@nomiclabs/hardhat-waffle'
import * as dotenv from "dotenv";
dotenv.config();

const API_URL: string | undefined = process.env.API_URL;
const PRIVATE_KEY1: string | undefined = process.env.PRIVATE_KEY1;
const PRIVATE_KEY2: string | undefined = process.env.PRIVATE_KEY2;
const PRIVATE_KEY3: string | undefined = process.env.PRIVATE_KEY3;
const PRIVATE_KEY4: string | undefined = process.env.PRIVATE_KEY4;

if (!API_URL || !PRIVATE_KEY1 || !PRIVATE_KEY2 || !PRIVATE_KEY3 || !PRIVATE_KEY4) {
  throw new Error("Please set your API_URL and PRIVATE_KEYs in a .env file");
}

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: "polygon_mumbai",
  networks: {
    hardhat: {
      chainId: 1337
    },
    rinkeby: {
      url: "https://eth-rinkeby.alchemyapi.io/v2/123abc123abc123abc123abc123abcde"
    },
    polygon_mumbai: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY1}`, `0x${PRIVATE_KEY2}`, `0x${PRIVATE_KEY3}`, `0x${PRIVATE_KEY4}`]
    }
  },
  mocha: {
    parallel: false,
    timeout: 80000
  }
};

export default config;
