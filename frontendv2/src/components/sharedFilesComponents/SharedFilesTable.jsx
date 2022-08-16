import { Box, Button, Checkbox, Typography } from '@mui/material'
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

function SharedFilesTable(props) {

    function createData(name, cid, ownerPublicKey, dateTime) {
        return { name, cid, ownerPublicKey, dateTime };
    }

    const rows = [
        createData('Top Secret 1', 'bafy98w747jfkjsdf8ur498dkfhsd', '0x8737efwi7r44876rw8guwyefgu3', '14-08-2022 19:11'),
        createData('Top Secret 2', 'bafy98498kdjsfk9924809r9hfdh8', '0xisjhf87er8ewgf8w7r687egfif9w', '14-08-2022 19:11'),
    ];

    const [selected, setSelected] = React.useState();

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
                            {rows.map((row) => {
                                const isItemSelected = isSelected(row.cid);
                                return (
                                    <TableRow
                                        key={row.cid}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        hover
                                        onClick={(event) => setSelected(row.cid)}
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
                                        <TableCell component="th" scope="row" align="right">{row.cid}</TableCell>
                                        <TableCell align="right">{row.ownerPublicKey}</TableCell>
                                        <TableCell align="right">{row.dateTime}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {rows.length == 0 && <React.Fragment><Box height={'30px'}></Box><Typography>You do not have any files shared by others in Sovereignity. When someone shares a file it will appear here.</Typography></React.Fragment>}
            </Box>
        </Box>
    )
}

export default SharedFilesTable