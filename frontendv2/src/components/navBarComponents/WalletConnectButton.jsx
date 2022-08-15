import { Box, Button } from '@mui/material'
import React from 'react'

function WalletConnectButton() {
    return (
        <Box marginLeft={'auto'}>
            <Button variant='outlined' sx={{ background: 'white', ":hover": { background: '#b3b3b3' } }}>Connect</Button>
        </Box>
    )
}

export default WalletConnectButton