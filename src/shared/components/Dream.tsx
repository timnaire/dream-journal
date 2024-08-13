import { Button, Card, Chip, debounce, Stack, Typography } from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { DreamModel } from '../models/dream';
import { useToFriendlyDate } from '../hooks/useToFriendlyDate';
import { motion, PanInfo } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';

export interface DreamProps {
  dream: DreamModel;
  onEditDream: (id: string) => void;
  onDeleteDream: (id: string) => void;
  onShowActions?: () => void;
}

export function Dream({ dream, onEditDream, onDeleteDream, onShowActions }: DreamProps) {
  const { isMobile } = useIsMobile();
  const createdAt = useToFriendlyDate(dream.createdAt, true);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.point.x < 0 && onShowActions) {
      debounce(onShowActions, 200);
    }
  };

  return (
    <motion.div drag={isMobile && 'x'} dragConstraints={{ left: 0, right: 0 }} onDrag={handleDrag}>
      <Card elevation={1} className="mb-5">
        <Stack direction="column">
          <Stack>
            <div className="flex justify-between">
              {/* Title */}
              <Typography className="text-2xl md:text-3xl ms-3 mt-3">{dream.title}</Typography>
              {/* Actions here */}
              <div className="flex">
                <Button onClick={() => onEditDream(dream.id)}>
                  <EditOutlined className="cursor-pointer" />
                </Button>
                <Button color="error" onClick={() => onDeleteDream(dream.id)}>
                  <DeleteOutline className="cursor-pointer" />
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
    </motion.div>
  );
}
