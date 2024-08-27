import { Button, Card, Chip, Stack, Typography } from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { Dream } from '../models/dream';
import { useToFriendlyDate } from '../hooks/useToFriendlyDate';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

export interface DreamCardProps {
  dream: Dream;
  onEditDream: (id: string) => void;
  onDeleteDream: (id: string) => void;
}

export function DreamCard({ dream, onEditDream, onDeleteDream }: DreamCardProps) {
  const { isMobile } = useIsMobile();
  const createdAt = useToFriendlyDate(dream.createdAt ? dream.createdAt : new Date(), true);

  const handleEdit = (): void => {
    onEditDream(dream.id!);
  };

  const handleDelete = (): void => onDeleteDream(dream.id!);

  return (
    <div className="flex relative mb-5">
      <motion.div
        className="grow z-10 md:!translate-x-0"
        drag={isMobile && 'x'}
        dragConstraints={{ left: -120, right: 0 }}
        // initial={{ left: x }}
        dragElastic={false}
        dragMomentum={false}
      >
        <Card elevation={1}>
          <Stack direction="column">
            <Stack>
              <div className="flex justify-between">
                {/* Title */}
                <Typography
                  className="text-lg sm:text-xl md:text-2xl m-3 mb-0 line-clamp-1"
                  sx={{ overflowWrap: 'anywhere' }}
                >
                  {dream.title}
                </Typography>
                {/* Actions here */}
                <div className="hidden md:flex">
                  <Button onClick={handleEdit}>
                    <EditOutlined className="cursor-pointer" />
                  </Button>
                  <Button color="error" onClick={handleDelete}>
                    <DeleteOutline className="cursor-pointer" />
                  </Button>
                </div>
              </div>
              <div className="p-3">
                <Typography className="text-xs">{createdAt}</Typography>
                <Typography className="mt-5 text-md line-clamp-3" sx={{ overflowWrap: 'anywhere' }}>
                  {dream.dream}
                </Typography>
                <div className="mt-3 line-clamp-2">
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
      </motion.div>

      <Card elevation={1} className="absolute right-0 h-full" sx={{ border: 0, boxShadow: 0 }}>
        <Stack className="flex justify-center" direction="row" sx={{ width: '125px', height: 'inherit' }}>
          <Button className="rounded-none" onClick={handleEdit}>
            <EditOutlined className="cursor-pointer" />
          </Button>
          <Button className="rounded-none" color="error" onClick={handleDelete}>
            <DeleteOutline className="cursor-pointer" />
          </Button>
        </Stack>
      </Card>
    </div>
  );
}
