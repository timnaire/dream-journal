import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { AvatarCard } from './AvatarCard';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { UserModel } from '../models/user';
import { DreamModel } from '../models/dream';

export interface DreamProps {
    dream: DreamModel,
    editDream: (id: string) => void;
    deleteDream: (id: string) => void;
}

export function Dream({ dream, editDream, deleteDream }: DreamProps) {
    return (
        <Card elevation={1} sx={{ width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
            {/* Actions here */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: '6px', pr: '6px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', ml: '6px' }}>
                    <Typography variant='subtitle1'>
                        Created: {dream.created}
                    </Typography>
                </Box>
                <Box>
                    <Button onClick={() => editDream(dream.id)}>
                        <EditOutlined sx={{ cursor: 'pointer', mr: '6px' }} />
                    </Button>
                    <Button onClick={() => deleteDream(dream.id)}>
                        <DeleteOutline sx={{ cursor: 'pointer' }} />
                    </Button>
                </Box>
            </Box>
            {/* Content here */}
            <Stack spacing={2} direction="column" sx={{ p: '10px' }}>
                {/* User information */}
                {/* <Stack direction="row" alignItems="start" sx={{ width: '100%' }}>
                    <AvatarCard name={dream.user.fullname} nameVariant="h6" caption='' />
                </Stack> */}

                {/* Body */}
                <Stack sx={{ minWidth: 0 }}>
                    <Typography variant="h5" sx={{ mb: '6px' }}>{dream.title}</Typography>
                    <Typography variant="caption">{dream.dream}</Typography>
                    <Box sx={{ mt: '6px' }}>
                        {/* {dream.categories.map(category => <Chip key={category} label={category} sx={{ mr: '4px' }} />)} */}
                        {dream.recurrent && <Chip label="Recurrent" sx={{ mr: '4px' }} />}
                        {dream.nightmare && <Chip label="Nightmare" sx={{ mr: '4px' }} />}
                        {dream.paralysis && <Chip label="Paralysis" sx={{ mr: '4px' }} />}
                        {dream.favorite && <Chip label="Favorite" sx={{ mr: '4px' }} />}
                    </Box>
                </Stack>
            </Stack>
        </Card>
    );
}