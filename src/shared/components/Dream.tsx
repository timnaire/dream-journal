import { Avatar, Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { DreamProps } from "../models/dream";

export function Dream({ dream }: { dream: DreamProps }) {
    return (
        <Paper elevation={1} sx={{ p: '10px', width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
            <Stack spacing={2} direction="column" alignItems="center">
                {/* User information */}
                <Stack direction="row" alignItems="start" sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {/* Initial Name */}
                        <Avatar>{dream.user.firstName.slice(0, 1)}</Avatar>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" sx={{ ml: '10px' }}>{dream.user.fullName}</Typography>
                            <Typography sx={{ ml: '10px', fontSize: '10px' }}>{dream.time}</Typography>
                        </Box>
                    </Box>
                </Stack>

                {/* Body */}
                <Stack sx={{ minWidth: 0 }}>
                    <Typography variant="h5" sx={{ mb: '6px' }}>{dream.title}</Typography>
                    <Typography variant="caption">{dream.dream}</Typography>
                    <Box sx={{ mt: '6px' }}>
                        {dream.categories.map(category => <Chip key={category} label={category} sx={{ mr: '4px' }} />)}
                    </Box>
                </Stack>
            </Stack>
        </Paper>
    );
}