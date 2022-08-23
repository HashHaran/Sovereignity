import { Box, Button } from '@mui/material'
import React from 'react'
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ShareIcon from '@mui/icons-material/Share';
import ListIcon from '@mui/icons-material/List';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { useNavigate } from 'react-router-dom';

function FileOptionsBar(props) {

    const navigate = useNavigate();

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '60%', display: 'flex', justifyContent: 'right' }}>
                <Button sx={{mr: 1}} onClick={props.handleFileSharingWindowOpen} variant='contained'><ShareIcon />Share</Button>
                <Button sx={{mr: 1}} onClick={(event) => {
                    event.preventDefault();
                    navigate('/mySharedFiles/'.concat(props.selectedCid));
                }} variant='contained'><ListIcon />Details</Button>
                <Button sx={{ mr: 1 }} onClick={props.handleFileDownload} variant='contained'><FileDownloadIcon />Download</Button>
                <Button onClick={props.handleFileDelete} variant='contained'><DeleteForeverIcon />Delete</Button>
            </Box>
        </Box>
    )
}

export default FileOptionsBar