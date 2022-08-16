import { Box, Checkbox, Typography } from '@mui/material'
import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(name, size, cid, status, storage, dateTime) {
    return { name, size, cid, status, storage, dateTime };
}

const rows = [
    createData('Top Secret 1', '100KB', 'bafyslsoof98yh9843hhf9w83ehkuw9e8fjdkhcksdjh', 'Pinned', '14-08-2022 19:11'),
    createData('Top Secret 2', '237KB', 'bafydfjsnf8874r80djkhkjsdfh88eyy7r4rehefvbi3', 'Uploaded', '14-08-2022 19:11'),
];

function MyFilesTable(props) {

    const isSelected = (cid) => props.selected === cid;

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
                                <TableCell align="right">Status</TableCell>
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
                                        onClick={(event) => {
                                            props.setSelected(row.cid);
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
                                        <TableCell align="right">{row.size}</TableCell>
                                        <TableCell component="th" scope="row" align="right">{row.cid}</TableCell>
                                        <TableCell align="right">{row.status}</TableCell>
                                        <TableCell align="right">{row.dateTime}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {rows.length == 0 && <React.Fragment><Box height={'30px'}></Box><Typography>You do not have any files uploaded to Sovereignity. Click on the upload button to get started.</Typography></React.Fragment>}
            </Box>
        </Box>
    )
}

export default MyFilesTable