import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from './Header';

export function BaseLayout() {
    return (
        <>
            <Header />
            <Box component="main" sx={{ height: '100%' }}>
                <Outlet />
            </Box>
            {/* <footer>Footer</footer> */}
        </>
    );
}