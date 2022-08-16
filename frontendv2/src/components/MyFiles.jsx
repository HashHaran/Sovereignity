import { Box, Button, Input } from '@mui/material'
import React, { useEffect } from 'react'
import FileOptionsBar from './myFilesComponents/FileOptionsBar'
import ProgressBarUpload from './myFilesComponents/ProgressBarUpload'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MyFilesTable from './myFilesComponents/MyFilesTable';
import ShareFileWindow from './myFilesComponents/ShareFileWindow';
import { Container } from '@mui/system';

function MyFiles() {

    const [selectedCid, setSelectedCid] = React.useState();
    const [selectedFileName, setSelectedFileName] = React.useState();

    // useEffect(() => {
    //     console.log(selectedCid);
    // }, [selectedCid])

    const [fileSharingWindowOpen, setFileSharingWindowOpen] = React.useState(false);
    const handleFileSharingWindowOpen = () => setFileSharingWindowOpen(true);
    const handleFileSharingWindowClose = () => setFileSharingWindowOpen(false);

    const handleFileUpload = (e) => {
        if (!e.target.files) {
            return;
        }
        console.log(e.target.files[0]);
    };

    return (
        <React.Fragment>
            <ProgressBarUpload />
            <Container sx={{ mb: 4 }}>
                {/* <Input classes={classes.fileInput} sx={{ mr: 4 }} onChange={handleFileUpload} type='file' color='primary'><FileUploadIcon /> Upload</Input> */}
                <Button variant='contained' component="label"><FileUploadIcon /> Upload<input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                /></Button>
            </Container>
            <FileOptionsBar handleFileSharingWindowOpen={handleFileSharingWindowOpen} selectedCid={selectedCid} />
            <ShareFileWindow open={fileSharingWindowOpen} handleClose={handleFileSharingWindowClose} selected={selectedFileName} />
            <MyFilesTable selected={selectedCid} setSelected={setSelectedCid} setSelectedFileName={setSelectedFileName} />
        </React.Fragment>
    )
}

export default MyFiles