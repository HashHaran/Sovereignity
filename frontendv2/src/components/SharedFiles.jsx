import React from 'react'
import SharedFilesTable from './sharedFilesComponents/SharedFilesTable'

function SharedFiles(props) {
    return (
        <SharedFilesTable permittedUser={props.permittedUser} />
    )
}

export default SharedFiles