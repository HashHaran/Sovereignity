import { Box, Button, Input } from '@mui/material'
import React, { useEffect } from 'react'
import FileOptionsBar from './myFilesComponents/FileOptionsBar'
import ProgressBarUpload from './myFilesComponents/ProgressBarUpload'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MyFilesTable from './myFilesComponents/MyFilesTable';
import ShareFileWindow from './myFilesComponents/ShareFileWindow';
import { Container } from '@mui/system';
import Web3storage from '../lib/web3storage';

function MyFiles(props) {

    const [selectedCid, setSelectedCid] = React.useState();
    const [selectedFileName, setSelectedFileName] = React.useState();
    const [uploadProgress, setUploadProgress] = React.useState(0);

    // useEffect(() => {
    //     console.log(selectedCid);
    // }, [selectedCid])

    const [fileSharingWindowOpen, setFileSharingWindowOpen] = React.useState(false);
    const handleFileSharingWindowOpen = () => setFileSharingWindowOpen(true);
    const handleFileSharingWindowClose = () => setFileSharingWindowOpen(false);

    let web3storage;
    useEffect(() => {
        if (props.provider) {
            web3storage = new Web3storage(props.provider, setUploadProgress);
        }
    }, [props.provider]);

    const handleFileUpload = (e) => {
        if (!e.target.files) {
            return;
        }
        // console.log(e.target.files[0]);
        web3storage.uploadEncryptedFileAndAddContent(e.target.files).then(() => {
            console.log('Done uploading and adding content');
        });
    };

    const handleFileDownload = (e) => {
        web3storage.downloadDecryptedFile(selectedCid);
    }

    return (
        <React.Fragment>
            <ProgressBarUpload progress={uploadProgress} />
            <Container sx={{ mb: 4 }}>
                {/* <Input classes={classes.fileInput} sx={{ mr: 4 }} onChange={handleFileUpload} type='file' color='primary'><FileUploadIcon /> Upload</Input> */}
                <Button variant='contained' component="label"><FileUploadIcon /> Upload<input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                    onClick={(e) => e.target.value = null}
                /></Button>
            </Container>
            <FileOptionsBar handleFileSharingWindowOpen={handleFileSharingWindowOpen} selectedCid={selectedCid} handleFileDownload={handleFileDownload} />
            <ShareFileWindow open={fileSharingWindowOpen} handleClose={handleFileSharingWindowClose} selected={selectedFileName} />
            <MyFilesTable selected={selectedCid} setSelected={setSelectedCid} setSelectedFileName={setSelectedFileName} />
        </React.Fragment>
    )
}

export default MyFiles