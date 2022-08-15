import { Box, Tab, Tabs } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

function NavLinks() {

    const navigate = useNavigate();

    function LinkTab(props) {
        return (
            <Tab
                component="a"
                onClick={(event) => {
                    event.preventDefault();
                    navigate(props.href);
                }}
                {...props}
            />
        );
    }

    const [value, setValue] = React.useState(0);

    const handleTabChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box marginLeft={'auto'} >
            <Tabs value={value} onChange={handleTabChange} textColor="secondary" indicatorColor='secondary'>
                <LinkTab label="My Files" href='/' color='secondary' />
                <LinkTab label="Shared" href='/shared' color='secondary' />
            </Tabs>
        </Box>
    )
}

export default NavLinks