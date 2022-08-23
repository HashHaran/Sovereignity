import { Box, Button, Input, Modal, TextField, Typography } from '@mui/material'
import React from 'react'

function TransferFileWindow(props) {

    const [userPublicKey, setUserPublicKey] = React.useState("0xF18Bb60E7Bd9BD65B61C57b9Dd89cfEb774274a1");

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 700,
        bgcolor: 'background.paper',
        // border: '1px solid #000',
        boxShadow: 24,
        // p: 4,
    };

    const onTransferFileToUser = () => {
        props.onTransferFileToUser(userPublicKey);
    }

    return (
        <div><Modal
            open={props.open}
            onClose={props.handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Box
                    sx={{
                        backgroundColor: "primary.main",
                    }}
                >
                    <Typography sx={{ ml: 1 }} id="modal-modal-title" variant="h6">
                        Transfer File: {props.selected}
                    </Typography>
                </Box>
                <Box
                    component="form"
                    sx={{
                        mt: 1,
                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <Typography sx={{ ml: 1 }} variant="h6" component="h9">
                        Public Key of User:
                    </Typography>
                    <TextField
                        onChange={(event) => setUserPublicKey(event.target.value)}
                        required
                        id="outlined-required"
                        label="required"
                        defaultValue={userPublicKey}
                        variant='outlined'
                        InputProps={{ sx: { height: 35, width: 400 } }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button onClick={onTransferFileToUser} sx={{ mb: 2, mt: 2 }} variant='contained'>Transfer</Button>
                </Box>
            </Box>
        </Modal></div>
    )
}

export default TransferFileWindow