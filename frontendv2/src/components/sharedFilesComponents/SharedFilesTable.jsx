import { Box, Button, Checkbox, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { useQuery, gql } from '@apollo/client';
import { convertEpochTimeToDateTime } from '../../lib/helper';

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

    function createData(name, cid, ownerPublicKey, dateTime) {
        return { name, cid, ownerPublicKey, dateTime };
    }

    const rows = [
        createData('Top Secret 1', 'bafy98w747jfkjsdf8ur498dkfhsd', '0x8737efwi7r44876rw8guwyefgu3', '14-08-2022 19:11'),
        createData('Top Secret 2', 'bafy98498kdjsfk9924809r9hfdh8', '0xisjhf87er8ewgf8w7r687egfif9w', '14-08-2022 19:11'),
    ];

    const [selected, setSelected] = React.useState();

    let permittedUser = props.permittedUser;
    console.log('Before firing query: %s', permittedUser);
    const { loading, error, data } = useQuery(GET_SHARED_FILES, {
        variables: { permittedUser },
        skip: !props.permittedUser
    });

    useEffect(() => {
        if (error) {
            console.log(`Error while fetching file permissions for user: ${props.permittedUser} from the graph`);
        }

        if (data) {
            console.log(data);
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
                            {data?.contentPermissions.map((contentPermission) => {
                                const isItemSelected = isSelected(contentPermission.content.contentId);
                                return (
                                    <TableRow
                                        key={contentPermission.content.contentId}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        hover
                                        onClick={(event) => setSelected(contentPermission.content.contentId)}
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
                                            {contentPermission.content.name}
                                        </TableCell>
                                        <TableCell component="th" scope="row" align="right">{contentPermission.content.contentId}</TableCell>
                                        <TableCell align="right">{contentPermission.content.owner}</TableCell>
                                        <TableCell align="right">{convertEpochTimeToDateTime(contentPermission.permittedTimeStamp)}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {!props.permittedUser && <React.Fragment><Box height={'30px'}></Box><Typography>Connect to your wallet to see files shared with you.</Typography></React.Fragment>}
                {!error && !loading && data?.contentPermissions.length==0 && <React.Fragment><Box height={'30px'}></Box><Typography>You do not have any files shared with others in Sovereignity. Click on the share button on home page to get started.</Typography></React.Fragment>}
                {error && <React.Fragment><Box height={'30px'}></Box><Typography>Error while fetching details about your files.</Typography></React.Fragment>}
                {loading && <React.Fragment><Box height={'30px'}></Box><Typography>Loading...</Typography></React.Fragment>}
            </Box>
        </Box>
    )
}

export default SharedFilesTable