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

function MySharedFilesTable(props) {

    function createData(name, cid, userPublicKey, dateTime) {
        return { name, cid, userPublicKey, dateTime };
    }

    const rows = [
        createData('Top Secret 1', props.cid, '0x8737efwi7r44876rw8guwyefgu3', '14-08-2022 19:11'),
        createData('Top Secret 2', props.cid, '0xisjhf87er8ewgf8w7r687egfif9w', '14-08-2022 19:11'),
    ];

    const [selected, setSelected] = React.useState();

    const isSelected = (userPublicKey) => selected === userPublicKey;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
            <Box sx={{ width: '60%', mr: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'right', mb: 2 }}>
                    <Button variant='contained'><PersonRemoveIcon sx={{ mr: 1 }} />Revoke Permission</Button>
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
                            {rows.map((row) => {
                                const isItemSelected = isSelected(row.userPublicKey);
                                return (
                                    <TableRow
                                        key={row.cid.concat(row.userPublicKey)}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        hover
                                        onClick={(event) => setSelected(row.userPublicKey)}
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
                                        <TableCell align="right">{row.userPublicKey}</TableCell>
                                        <TableCell align="right">{row.dateTime}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                {rows.length == 0 && <React.Fragment><Box height={'30px'}></Box><Typography>You do not have any files shared with others in Sovereignity. Click on the share button on home page to get started.</Typography></React.Fragment>}
            </Box>
        </Box>
    )
}

export default MySharedFilesTable