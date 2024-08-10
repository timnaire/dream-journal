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
    <Card elevation={1} className="mb-5">
      <Stack direction="column">
        <Stack>
          <div className="flex justify-between">
            {/* Title */}
            <Typography className="text-2xl md:text-3xl ms-3 mt-3">
              {dream.title}
            </Typography>
            {/* Actions here */}
            <div className="flex justify-end">
              <Button onClick={() => editDream(dream.id)}>
                <EditOutlined className="cursor-pointer w-5" />
              </Button>
              <Button onClick={() => deleteDream(dream.id)}>
                <DeleteOutline className="cursor-pointer w-5" />
              </Button>
            </div>
          </div>
          <div className="p-3">
            <Typography className="text-xs">{createdAt}</Typography>
            <Typography className="mt-5 text-md">{dream.dream}</Typography>
            <div className="mt-3">
              {/* {dream.categories.map(category => <Chip key={category} label={category} sx={{ mr: '4px' }} />)} */}
              {dream.recurrent && <Chip label="Recurrent" className="me-2 mb-2" />}
              {dream.nightmare && <Chip label="Nightmare" className="me-2 mb-2" />}
              {dream.paralysis && <Chip label="Paralysis" className="me-2 mb-2" />}
              {dream.favorite && <Chip label="Favorite" className="me-2 mb-2" />}
            </div>
          </div>
        </Stack>
      </Stack>
    </Card>
  );
}
