import { Box, Button, Input, Modal, TextField, Typography } from '@mui/material'
import React from 'react'

function ShareFileWindow(props) {

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
                        Share File: bafy9898798fhjf87974oehkdhf
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
                        required
                        id="outlined-required"
                        label="required"
                        defaultValue="0x48948hgewyyw7wegwg774984977gkedfh978g"
                        variant='outlined'
                        InputProps={{ sx: { height: 35, width: 400 } }}
                    />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button sx={{ mb: 2, mt: 2 }} variant='outlined'>Share</Button>
                </Box>
            </Box>
        </Modal></div>
    )
}

export default ShareFileWindow