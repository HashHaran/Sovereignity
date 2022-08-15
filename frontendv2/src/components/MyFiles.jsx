import { Box, Button } from '@mui/material'
import React from 'react'
import FileOptionsBar from './myFilesComponents/FileOptionsBar'
import ProgressBarUpload from './myFilesComponents/ProgressBarUpload'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import MyFilesTable from './myFilesComponents/MyFilesTable';
import ShareFileWindow from './myFilesComponents/ShareFileWindow';

function MyFiles() {

    const [fileSharingWindowOpen, setFileSharingWindowOpen] = React.useState(false);
    const handleFileSharingWindowOpen = () => setFileSharingWindowOpen(true);
    const handleFileSharingWindowClose = () => setFileSharingWindowOpen(false);

    return (
        <React.Fragment>
            <ProgressBarUpload />
            <Button variant='outlined'><FileUploadIcon /> Upload</Button>
            <FileOptionsBar handleFileSharingWindowOpen={handleFileSharingWindowOpen} />
            <ShareFileWindow open={fileSharingWindowOpen} handleClose={handleFileSharingWindowClose} />
            <MyFilesTable />
        </React.Fragment>
    )
}

export default MyFiles