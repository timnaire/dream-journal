import { EditOutlined } from "@mui/icons-material";
import { Avatar, Box, Button, Chip, Container, Paper, Stack, Typography } from "@mui/material";
import { useDreams } from "../shared/hooks/useDreams";


export function Home() {
    const { dreams } = useDreams();

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', overflow: 'hidden', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'end', p: '10px', width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
                    <Button variant="contained"><EditOutlined sx={{ mr: '6px' }} /> Write a dream</Button>
                </Box>

                {dreams.map((dream) => (
                    <Paper key={dream.id} elevation={1} sx={{ p: '10px', width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
                        <Stack spacing={2} direction="column" alignItems="center">
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
                            <Stack sx={{ minWidth: 0 }}>
                                <Typography variant="h5" sx={{ mb: '6px' }}>{dream.title}</Typography>
                                <Typography variant="caption">{dream.dream}</Typography>
                                <Box sx={{ mt: '6px' }}>
                                    {dream.categories.map(category => <Chip key={category} label={category} sx={{ mr: '4px' }} />)}
                                </Box>
                            </Stack>
                        </Stack>
                    </Paper>
                ))}
            </Box>
        </Container>
    );
}