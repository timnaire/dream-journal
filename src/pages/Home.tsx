import { useContext, useState } from 'react';
import { EditOutlined } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { useDreams } from '../shared/hooks/useDreams';
import { Dream } from '../shared/components/Dream';
import { AppContext } from '../core/context/AppContext';
import { Loading } from '../shared/components/Loading';
import { DreamModal } from '../shared/components/DreamModal';

export function Home() {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useContext(AppContext);
    const { dreams, isLoading } = useDreams();

    const handleWriteDreamOpen = (): void => setIsOpen(true);
    const handleWriteDreamClose = (): void => setIsOpen(false);

    if (isLoading) {
        return <Loading />;
    }

    console.log('user', user);

    return (
        <Container>

            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', overflow: 'hidden', p: 3 }}>

                <Box sx={{ display: 'flex', py: '10px', width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
                    <Typography variant="h4">
                        Hi Welcome, {user?.firstname}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'end', py: '10px', width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
                    <Button variant="contained" onClick={handleWriteDreamOpen}><EditOutlined sx={{ mr: '6px' }} /> Write a dream</Button>
                </Box>

                {/* Dream entries */}
                {dreams && dreams.map((dream) => <Dream key={dream.id} dream={dream} />)}
            </Box>

            <DreamModal isOpen={isOpen} handleWriteDreamClose={handleWriteDreamClose} />

        </Container >
    );
}