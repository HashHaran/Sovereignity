import { Box, Button, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useQuery, gql, useApolloClient } from '@apollo/client';
import { convertEpochTimeToDateTime } from '../../lib/helper';
import contentDataService from '../../lib/contentDataService';

const GET_SHARED_FILES = gql`
    query GetSharedFiles($permittedUser: String!) {
        contentPermissions(where: {permittedUser: $permittedUser}) {
            id
            content {
                id
                contentId
                owner
            }
            permittedUser
            permittedTimeStamp
        }
    }`;

function SharedFilesTable(props) {

    const [selected, setSelected] = React.useState();

    let permittedUser = props.permittedUser;
    console.log('Before firing query: %s', permittedUser);
    const { loading, error, data } = useQuery(GET_SHARED_FILES, {
        variables: { permittedUser },
        skip: !props.permittedUser,
        fetchPolicy: 'cache-and-network'
    });

    useEffect(() => {
        if (props.rows.length == 0 && props.permittedUser && !props.sharedFilesQueryCompleted) {

            if (error) console.error(`Error during The Graph query: ${error}`);
            if (data) {
                console.log("data");
                console.log(data);

                if (data.contentPermissions.length != 0) {
                    let contentNamePromises = [];
                    for (let contentPermission of data.contentPermissions) {
                        if (!props.sharedFilesName.get(contentPermission.content.contentId)) {
                            contentNamePromises.push(contentDataService.getContentForCid(contentPermission.content.contentId));
                        }
                    }

                    let rows = [];
                    if (contentNamePromises.length != 0) {
                        Promise.all(contentNamePromises).then((contentNames) => {
                            console.log("contentNames");
                            console.log(contentNames);
                            let contentNameMap = props.sharedFilesName;
                            contentNames.forEach((contentName) => {
                                contentNameMap.set(contentName.data.contentId, contentName.data.content.name);
                            });
                            console.log("contents name map");
                            console.log(contentNameMap);
                            props.setSharedFilesName(contentNameMap);
                            for (let contentPermission of data.contentPermissions) {
                                let row = { contentPermission: contentPermission };
                                row.name = contentNameMap.get(contentPermission.content.contentId);
                                rows.push(row);
                                console.log("rows");
                                console.log(rows);
                            }
                            props.setRows(rows);
                            props.setSharedFilesQueryCompleted(true);
                        });
                    } else {
                        props.setSharedFilesQueryCompleted(true);
                    }
                }
            }
        }
    });

    const isSelected = (cid) => selected === cid;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Box sx={{ width: '60%', mr: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}>
                    <Button variant='contained'><FileDownloadIcon sx={{ mr: 1 }} />Download</Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>File Name</TableCell>
                                <TableCell align="right">Content ID</TableCell>
                                <TableCell align="right">File Owner</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.rows.map((row) => {
                                const isItemSelected = isSelected(row.contentPermission.content.contentId);
                                return (
                                    <TableRow
                                        key={row.contentPermission.content.contentId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        hover
                                        onClick={(event) => setSelected(row.contentPermission.content.contentId)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={isItemSelected}
                                            />
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="right">{row.contentPermission.content.contentId}</TableCell>
                                        <TableCell align="right">{row.contentPermission.content.owner}</TableCell>
                                        <TableCell align="right">{convertEpochTimeToDateTime(row.contentPermission.permittedTimeStamp)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!props.permittedUser && <React.Fragment><Box height={'30px'}></Box><Typography>Connect to your wallet to see files shared with you.</Typography></React.Fragment>}
                {!error && !loading && props.rows.length==0 && <React.Fragment><Box height={'30px'}></Box><Typography>You do not have any files shared with you in Sovereignity. When someone shares a file with you it wil appear here.</Typography></React.Fragment>}
                {error && <React.Fragment><Box height={'30px'}></Box><Typography>Error while fetching details about your files.</Typography></React.Fragment>}
                {(loading || !props.sharedFilesQueryCompleted) && <React.Fragment><Box height={'30px'}></Box><Typography>Loading...</Typography></React.Fragment>}
            </Box>
        </Box>
    )
}

export default SharedFilesTable