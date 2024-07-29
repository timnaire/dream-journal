import { Avatar, Box, Typography } from '@mui/material';
import { Variant } from '@mui/material/styles/createTypography';

interface AvatarCardProps {
    name?: string;
    nameVariant: Variant;
    caption?: string;
}

export function AvatarCard({ name, nameVariant, caption }: AvatarCardProps) {
    const defaultAvatar = name ? name.split(' ').map(n => n.slice(0, 1)).join('') : '';

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: '6px', cursor: 'default' }}>
            <Avatar>{defaultAvatar}</Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant={nameVariant} sx={{ ml: '10px' }}>{name}</Typography>
                <Typography sx={{ ml: '10px', fontSize: '10px' }}>{caption}</Typography>
            </Box>
        </Box>
    );
}