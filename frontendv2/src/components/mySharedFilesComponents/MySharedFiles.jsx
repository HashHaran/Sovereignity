import React from 'react'
import { useParams } from 'react-router-dom'
import MySharedFilesTable from './MySharedFilesTable'

function MySharedFiles() {

    let { cid } = useParams();

    return (
        <MySharedFilesTable cid={cid} />
    )
}

export default MySharedFiles