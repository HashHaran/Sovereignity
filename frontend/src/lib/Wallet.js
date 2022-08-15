import { ethers } from "ethers";
import Web3Modal from "web3modal";
import Portis from "@portis/web3";

const providerOptions = {
    portis: {
        package: Portis, // required
        options: {
          id: "PORTIS_ID" // required
        }
    },
    binancechainwallet: {
        package: true
    }
    
};

export default async function authenticate () {
    const web3Modal = new Web3Modal({
        network: "mainnet", // optional
        cacheProvider: true, // optional
        providerOptions // required
      });
      
      const instance = await web3Modal.connect();
      
      const provider = new ethers.providers.Web3Provider(instance);
    return provider;
  }