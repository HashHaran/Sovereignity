import { Box, Button } from '@mui/material'
import React from 'react'

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

function WalletConnectButton(props) {

    async function authenticateAndSetProvider() {
        const web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: true, // optional
            providerOptions // required
        });

        let instance = await web3Modal.connect();

        const provider = new ethers.providers.Web3Provider(instance);
        const owner = await provider.getSigner().getAddress();
        props.setStuffBasedOnWallet(provider, owner);
    }

    return (
        <Box marginLeft={'auto'}>
            <Button onClick={authenticateAndSetProvider} variant='outlined' sx={{ background: 'white', ":hover": { background: '#b3b3b3' } }}>Connect</Button>
        </Box>
    )
}

export default WalletConnectButton