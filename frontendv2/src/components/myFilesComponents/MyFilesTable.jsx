import { Box, Checkbox, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { useQuery, gql } from '@apollo/client';
import { convertEpochTimeToDateTime } from '../../lib/helper';

const GET_MY_FILES = gql`
    query GetMyFiles($owner: String!) {
        contents(where: {owner: $owner}) {
            id
            contentId
            creationTimeStamp
        }
}
`;

function MyFilesTable(props) {

    const isSelected = (contentId) => props.selected === contentId;

    // const onTheGraphQueryCompleted = (data) => {
    //     let web3StatusPromises = [];
    //     for (let content of data.contents) {
    //         web3StatusPromises.push(props.web3storage.getStatus(content.contentId));
    //     }
    //     Promise.all(web3StatusPromises).then((statuses) => {
    //         statuses.forEach((status, i) => {
    //             let row = { content: data.contents[i] };
    //             console.log("status");
    //             console.log(status);
    //             row.web3StorageStatus = status;
    //             rows.push(row);
    //             console.log("rows");
    //             console.log(rows);
    //         });
    //         props.setMyFilesQueryCompleted(true);
    //     });
    // }

    // const onTheGraphError = (error) => {
    //     console.error(`Error during The Graph query: ${error}`);
    // }
                

    let owner = props.owner;
    console.log('Before firing query: %s', owner);
    const { loading, error, data } = useQuery(GET_MY_FILES, {
        variables: { owner },
        skip: !props.owner,
        // onCompleted: onTheGraphQueryCompleted,
        // onError: onTheGraphError
    });

    useEffect(() => {
        if (props.rows.length == 0 && props.owner && !props.myFilesQueryCompleted) {

            if (error) console.error(`Error during The Graph query: ${error}`);
            if (data) {
                console.log("data");
                console.log(data);
                if (data.contents.length != 0) {
                    let web3StatusPromises = [];
                    for (let content of data.contents) {
                        if (!props.myFilesWeb3StorageStatus.get(content.contentId)) {
                            web3StatusPromises.push(props.web3storage.getStatus(content.contentId));
                        }
                    }

                    let rows = [];
                    if (web3StatusPromises.length != 0) {
                        Promise.all(web3StatusPromises).then((statuses) => {
                            console.log("statuses");
                            console.log(statuses);
                            let statusMap = new Map();
                            statuses.forEach((status) => {
                                statusMap.set(status.cid, status);
                            });
                            props.setMyFilesWeb3StorageStatus(statusMap);

                            for (let content of data.contents) {
                                let row = { content: content };
                                row.web3StorageStatus = statusMap.get(content.contentId);
                                rows.push(row);
                                console.log("rows");
                                console.log(rows);
                            }
    
                            props.setRows(rows);
                            props.setMyFilesQueryCompleted(true);
                        });
                    } else {
                        for (let content of data.contents) {
                            let row = { content: content };
                            row.web3StorageStatus = props.myFilesWeb3StorageStatus.get(content.contentId);
                            rows.push(row);
                            console.log("rows");
                            console.log(rows);
                        }
                        props.setRows(rows);
                        props.setMyFilesQueryCompleted(true);
                    }
                } else {
                    props.setMyFilesQueryCompleted(true);
                }
            }
        }
    });

    const activeDealsCount = (deals) => {
        let dealCount = 0;
        for (let deal of deals) {
            if (deal.status === 'Active') dealCount++;
        }
        return dealCount;
    }

    const summaryPinningStatus = (pins) => {
        let pinStatusCount = {};
        for (let pin of pins) {
            if (pin.status === 'Pinned') return pin.status;
            else {
                pinStatusCount[pin.status]? pinStatusCount[pin.status]++: pinStatusCount[pin.status] = 1;
            }
        }
        if (pinStatusCount['PinQueued'] && pinStatusCount['PinQueued'] > 0) return 'PinQueued';
        return 'Unpinned';
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '60%', mr: 1 }}>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>File Name</TableCell>
                                <TableCell align="right">Size</TableCell>
                                <TableCell align="right">Content ID</TableCell>
                                <TableCell align="right">Pinning Status</TableCell>
                                <TableCell align="right">Filecoin Deals</TableCell>
                                <TableCell align="right">Created Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {props.rows.map((row) => {
                                const isItemSelected = isSelected(row.content.contentId);
                                return (
                                    <TableRow
                                        key={row.content.contentId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        hover
                                        onClick={(event) => {
                                            props.setSelected(row.content.contentId);
                                            props.setSelectedFileName(row.name);
                                        }}
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
                                        <TableCell align="right">{row.web3StorageStatus.dagSize}</TableCell>
                                        <TableCell component="th" scope="row" align="right">{row.content.contentId}</TableCell>
                                        <TableCell align="right">{summaryPinningStatus(row.web3StorageStatus.pins)}</TableCell>
                                        <TableCell align="right">{activeDealsCount(row.web3StorageStatus.deals)}</TableCell>
                                        <TableCell align="right">{convertEpochTimeToDateTime(row.content.creationTimeStamp)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {props.myFilesQueryCompleted && props.rows.length==0 && props.owner && !loading && !error && <React.Fragment><Box height={'30px'}></Box><Typography>You do not have any files uploaded to Sovereignity. Click on the upload button to get started.</Typography></React.Fragment>}
                {!props.owner && <React.Fragment><Box height={'30px'}></Box><Typography>Conect with your wallet to see your files.</Typography></React.Fragment>}
                {!props.myFilesQueryCompleted && (loading || props.rows.length==0) && props.owner && <React.Fragment><Box height={'30px'}></Box><Typography>Loading...</Typography></React.Fragment>}
                {error && <React.Fragment><Box height={'30px'}></Box><Typography>Error while fetching your files from The Graph.</Typography></React.Fragment>}
            </Box>
        </Box>
    )
}

export default MyFilesTable