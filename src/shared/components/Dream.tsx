import { Box, Card, Chip, Stack, Typography } from '@mui/material';
import { DreamProps } from '../models/dream';
import { AvatarCard } from './AvatarCard';

export function Dream({ dream }: { dream: DreamProps }) {
    return (
        <Card elevation={1} sx={{ width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
            <Stack spacing={2} direction="column" alignItems="center" sx={{ p: '10px' }}>
                {/* User information */}
                <Stack direction="row" alignItems="start" sx={{ width: '100%' }}>
                    <AvatarCard name={dream.user.fullname} nameVariant="h6" caption={dream.time} />
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
        </Card>
    );
}