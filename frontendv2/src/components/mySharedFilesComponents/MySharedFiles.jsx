import React from 'react'
import { useParams } from 'react-router-dom'
import MySharedFilesTable from './MySharedFilesTable'

function MySharedFiles(props) {

    let { cid } = useParams();
    let { fileName } = useParams();

    return (
        <MySharedFilesTable cid={cid} fileName={fileName} sovereignity={props.sovereignity} />
    )
}

export default MySharedFiles