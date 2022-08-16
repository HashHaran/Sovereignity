import { AppBar, Box, Stack, Toolbar, Typography } from '@mui/material'
import React from 'react'
import NavLinks from './navBarComponents/NavLinks'
import WalletConnectButton from './navBarComponents/WalletConnectButton'

function NavigationBar(props) {
    return (
        <div>
            <AppBar>
                <Toolbar>
                    <Typography variant='h4'>
                        Sovereignity
                    </Typography>
                    <NavLinks />
                    <WalletConnectButton setProvider={props.setProvider} />
                </Toolbar>
            </AppBar>
        </div >
    )
}

export default NavigationBar