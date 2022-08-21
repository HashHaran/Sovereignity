import { Box, Button, Checkbox, Typography } from '@mui/material'
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { useQuery, gql } from '@apollo/client';
import { convertEpochTimeToDateTime } from '../../lib/helper';

const GET_MY_SHARED_FILES = gql`
    query GetMySharedFiles($contentId: String!) {
        contents(where: {contentId: $contentId}) {
            id
            contentId
            permissions {
                id
                permittedUser
                permittedTimeStamp
            }
        }
    }`;

function MySharedFilesTable(props) {

    const [selected, setSelected] = React.useState();

    let cid = props.cid;
    console.log('Before firing query: %s', cid);
    const { loading, error, data } = useQuery(GET_MY_SHARED_FILES, {
        variables: { contentId: props.cid }
    });

    if (error) {
        console.log(`Error while fetching file permissions for cid: ${props.cid} from the graph`);
    }

    if (data) {
        console.log(data);
    }

    const isSelected = (userPublicKey) => selected === userPublicKey;
    
    const onRevokePermission = () => {
        props.sovereignity.revokePermissionToContent(props.cid, selected);
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Box sx={{ width: '60%', mr: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}>
                    <Button onClick={onRevokePermission} variant='contained'><PersonRemoveIcon sx={{ mr: 1 }} />Revoke Permission</Button>
                </Box>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>File Name</TableCell>
                                <TableCell align="right">Content ID</TableCell>
                                <TableCell align="right">Shared User</TableCell>
                                <TableCell align="right">Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.contents[0].permissions.map((permission) => {
                                const isItemSelected = isSelected(permission.permittedUser);
                                return (
                                    <TableRow
                                        key={props.cid.concat(permission.permittedUser)}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        hover
                                        onClick={(event) => setSelected(permission.permittedUser)}
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
                                            {permission.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="right">{props.cid}</TableCell>
                                        <TableCell align="right">{permission.permittedUser}</TableCell>
                                        <TableCell align="right">{convertEpochTimeToDateTime(permission.permittedTimeStamp)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!error && !loading && data.contents[0].permissions.length==0 && <React.Fragment><Box height={'30px'}></Box><Typography>You do not have any files shared with others in Sovereignity. Click on the share button on home page to get started.</Typography></React.Fragment>}
                {error && <React.Fragment><Box height={'30px'}></Box><Typography>Error while fetching details about your files.</Typography></React.Fragment>}
                {loading && <React.Fragment><Box height={'30px'}></Box><Typography>Loading...</Typography></React.Fragment>}
            </Box>
        </Box>
    )
}

export default MySharedFilesTable