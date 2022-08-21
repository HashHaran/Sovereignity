import React from 'react'
import { useParams } from 'react-router-dom'
import MySharedFilesTable from './MySharedFilesTable'

function MySharedFiles(props) {

    let { cid } = useParams();

    return (
        <MySharedFilesTable cid={cid} sovereignity={props.sovereignity} />
    )
}

export default MySharedFiles