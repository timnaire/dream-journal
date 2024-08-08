import { Box, Button, Card, Chip, Stack, Typography } from '@mui/material';
import { AvatarCard } from './AvatarCard';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { UserModel } from '../models/user';
import { DreamModel } from '../models/dream';
import moment from 'moment';
import { useToFriendlyDate } from '../hooks/useToFriendlyDate';

export interface DreamProps {
  dream: DreamModel;
  editDream: (id: string) => void;
  deleteDream: (id: string) => void;
}

export function Dream({ dream, editDream, deleteDream }: DreamProps) {
  const createdAt = useToFriendlyDate(dream.createdAt, true);

  return (
    <Card elevation={1} sx={{ width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
      {/* Actions here */}
      <div className="flex justify-end">
        <Button onClick={() => editDream(dream.id)}>
          <EditOutlined className="cursor-pointer w-5" />
        </Button>
        <Button onClick={() => deleteDream(dream.id)}>
          <DeleteOutline className="cursor-pointer w-5" />
        </Button>
      </div>

      {/* Content here */}
      <Stack spacing={2} direction="column" sx={{ p: '10px' }}>
        {/* User information */}
        {/* <Stack direction="row" alignItems="start" sx={{ width: '100%' }}>
                    <AvatarCard name={dream.user.fullname} nameVariant="h6" caption='' />
                </Stack> */}

        {/* Body */}
        <Stack sx={{ minWidth: 0 }}>
          <Typography variant="h5" sx={{ mb: '6px' }}>
            {dream.title}
          </Typography>
          <Typography className="text-xs">{createdAt}</Typography>
          <Typography className="mt-5 text-md">{dream.dream}</Typography>
          <div className="mt-3">
            {/* {dream.categories.map(category => <Chip key={category} label={category} sx={{ mr: '4px' }} />)} */}
            {dream.recurrent && <Chip label="Recurrent" className="me-2" />}
            {dream.nightmare && <Chip label="Nightmare" className="me-2" />}
            {dream.paralysis && <Chip label="Paralysis" className="me-2" />}
            {dream.favorite && <Chip label="Favorite" className="me-2" />}
          </div>
        </Stack>
      </Stack>
    </Card>
  );
}
