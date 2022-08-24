import { Box, Button, Input } from '@mui/material'
import React, { useEffect } from 'react'
import FileOptionsBar from './myFilesComponents/FileOptionsBar'
import ProgressBarUpload from './myFilesComponents/ProgressBarUpload'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MyFilesTable from './myFilesComponents/MyFilesTable';
import ShareFileWindow from './myFilesComponents/ShareFileWindow';
import { Container } from '@mui/system';
import { getPermittedUsersForContent } from '../lib/helper';
import { useApolloClient } from '@apollo/client';
import TransferFileWindow from './myFilesComponents/TransferFileWindow';
import contentDataService from '../lib/contentDataService';

function MyFiles(props) {

    const [selectedCid, setSelectedCid] = React.useState();
    const [selectedFileName, setSelectedFileName] = React.useState();

    const [fileSharingWindowOpen, setFileSharingWindowOpen] = React.useState(false);
    const [fileTransferWindowOpen, setFileTransferWindowOpen] = React.useState(false);

    const [rows, setRows] = React.useState([]);
    const [myFilesQueryCompleted, setMyFilesQueryCompleted] = React.useState(false);

    const apolloClient = useApolloClient();

    const handleFileSharingWindowOpen = () => setFileSharingWindowOpen(true);
    const handleFileSharingWindowClose = () => setFileSharingWindowOpen(false);

    const handleFileTransferWindowOpen = () => setFileTransferWindowOpen(true);
    const handleFileTransferWindowClose = () => setFileTransferWindowOpen(false);

    const handleFileUpload = (e) => {
        if (!e.target.files) {
            return;
        }
        // console.log(e.target.files[0]);
        props.web3storage.uploadEncryptedFileAndAddContent(e.target.files, props.owner).then(() => {
            console.log('Done uploading and adding content');
        });
    };

    const handleFileDownload = (e) => {
        props.web3storage.downloadDecryptedFile(selectedCid);
    }

    const handleFileDelete = async () => {
        const permittedUsers = await getPermittedUsersForContent(selectedCid, apolloClient);
        console.log(permittedUsers);
        await props.web3storage?.sovereignity.deleteContent(selectedCid, permittedUsers);
        await contentDataService.markContentInactive(selectedCid);
        console.log(`Content marked inactive cid: ${selectedCid}`);
    }

    const onShareFileWithUser = (userPublicKey) => {
        props.web3storage?.sovereignity.shareContent(selectedCid, userPublicKey).then(() => {
            console.log(`Content Shared with: ${userPublicKey}`);
        });
    }

    const onTransferFileToUser = async (userPublicKey) => {
        const permittedUsers = await getPermittedUsersForContent(selectedCid, apolloClient);
        console.log(permittedUsers);
        await props.web3storage?.sovereignity.transferContent(selectedCid, userPublicKey, permittedUsers);
        await contentDataService.updateContentOwner(selectedCid, userPublicKey);
        console.log(`Content Transfered to: ${userPublicKey}`);
    }

    return (
        <React.Fragment>
            <ProgressBarUpload progress={props.uploadProgress} />
            <Container sx={{ mb: 4 }}>
                <Button variant='contained' component="label"><FileUploadIcon /> Upload<input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                    onClick={(e) => e.target.value = null}
                /></Button>
            </Container>
            <FileOptionsBar handleFileTransferWindowOpen={handleFileTransferWindowOpen} handleFileSharingWindowOpen={handleFileSharingWindowOpen} selectedCid={selectedCid} selectedFileName={selectedFileName} handleFileDownload={handleFileDownload} handleFileDelete={handleFileDelete} />
            <ShareFileWindow open={fileSharingWindowOpen} handleClose={handleFileSharingWindowClose} selected={selectedFileName} onShareFileWithUser={onShareFileWithUser} />
            <TransferFileWindow open={fileTransferWindowOpen} handleClose={handleFileTransferWindowClose} selected={selectedFileName} onTransferFileToUser={onTransferFileToUser} />
            <MyFilesTable owner={props.owner} selected={selectedCid} setSelected={setSelectedCid} setSelectedFileName={setSelectedFileName} web3storage={props.web3storage} rows={rows} setRows={setRows} myFilesQueryCompleted={myFilesQueryCompleted} setMyFilesQueryCompleted={setMyFilesQueryCompleted} myFilesWeb3StorageStatus={props.myFilesWeb3StorageStatus} setMyFilesWeb3StorageStatus={props.setMyFilesWeb3StorageStatus} />
        </React.Fragment>
    )
}

export default MyFiles