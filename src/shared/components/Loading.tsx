import { Box, CircularProgress } from '@mui/material';

export function Loading() {
    return (
        <Box sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <CircularProgress />
                <Box sx={{ mt: '6px' }}>
                    Loading...
                </Box>
            </Box>
        </Box>
    );
}