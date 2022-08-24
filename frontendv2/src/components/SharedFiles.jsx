import React from 'react'
import SharedFilesTable from './sharedFilesComponents/SharedFilesTable'

function SharedFiles(props) {

    const [rows, setRows] = React.useState([]);
    const [sharedFilesQueryCompleted, setSharedFilesQueryCompleted] = React.useState(false);

    return (
        <SharedFilesTable permittedUser={props.permittedUser} rows = {rows} setRows = {setRows} sharedFilesQueryCompleted = {sharedFilesQueryCompleted} setSharedFilesQueryCompleted = {setSharedFilesQueryCompleted} sharedFilesName={props.sharedFilesName} setSharedFilesName={props.setSharedFilesName}  />
    )
}

export default SharedFiles