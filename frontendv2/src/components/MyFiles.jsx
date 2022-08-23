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

function MyFiles(props) {

    const [selectedCid, setSelectedCid] = React.useState();
    const [selectedFileName, setSelectedFileName] = React.useState();

    const [fileSharingWindowOpen, setFileSharingWindowOpen] = React.useState(false);

    const [rows, setRows] = React.useState([]);
    const [myFilesQueryCompleted, setMyFilesQueryCompleted] = React.useState(false);

    const apolloClient = useApolloClient();

    const handleFileSharingWindowOpen = () => setFileSharingWindowOpen(true);
    const handleFileSharingWindowClose = () => setFileSharingWindowOpen(false);

    const handleFileUpload = (e) => {
        if (!e.target.files) {
            return;
        }
        // console.log(e.target.files[0]);
        props.web3storage.uploadEncryptedFileAndAddContent(e.target.files).then(() => {
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
    }

    const onShareFileWithUser = (userPublicKey) => {
        props.web3storage?.sovereignity.shareContent(selectedCid, userPublicKey).then(() => {
            console.log(`Content Shared with: ${userPublicKey}`);
        });
    }

    return (
        <React.Fragment>
            <ProgressBarUpload progress={props.uploadProgress} />
            <Container sx={{ mb: 4 }}>
                {/* <Input classes={classes.fileInput} sx={{ mr: 4 }} onChange={handleFileUpload} type='file' color='primary'><FileUploadIcon /> Upload</Input> */}
                <Button variant='contained' component="label"><FileUploadIcon /> Upload<input
                    type="file"
                    hidden
                    onChange={handleFileUpload}
                    onClick={(e) => e.target.value = null}
                /></Button>
            </Container>
            <FileOptionsBar handleFileSharingWindowOpen={handleFileSharingWindowOpen} selectedCid={selectedCid} handleFileDownload={handleFileDownload} handleFileDelete={handleFileDelete} />
            <ShareFileWindow open={fileSharingWindowOpen} handleClose={handleFileSharingWindowClose} selected={selectedFileName} onShareFileWithUser={onShareFileWithUser} />
            <MyFilesTable owner={props.owner} selected={selectedCid} setSelected={setSelectedCid} setSelectedFileName={setSelectedFileName} web3storage={props.web3storage} rows={rows} setRows={setRows} myFilesQueryCompleted={myFilesQueryCompleted} setMyFilesQueryCompleted={setMyFilesQueryCompleted} myFilesWeb3StorageStatus={props.myFilesWeb3StorageStatus} setMyFilesWeb3StorageStatus={props.setMyFilesWeb3StorageStatus} />
        </React.Fragment>
    )
}

export default MyFiles