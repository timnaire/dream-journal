import { Button, Card, Chip, debounce, Stack, Typography } from '@mui/material';
import { DeleteOutline, EditOutlined } from '@mui/icons-material';
import { DreamModel } from '../models/dream';
import { useToFriendlyDate } from '../hooks/useToFriendlyDate';
import { motion, PanInfo } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { useEffect, useState } from 'react';
import { Breakpoints } from '../../core/models/constants';

export interface DreamProps {
  dream: DreamModel;
  onEditDream: (id: string) => void;
  onDeleteDream: (id: string) => void;
}

export function Dream({ dream, onEditDream, onDeleteDream }: DreamProps) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const { isMobile } = useIsMobile(Breakpoints.MD);
  const createdAt = useToFriendlyDate(dream.createdAt, true);
  const debounceDelete = debounce(setShowDelete, 200);
  const debounceEdit = debounce(setShowEdit, 200);

  useEffect(() => {
    if (!isMobile) {
      setShowEdit(false);
      setShowDelete(false);
    }
  }, [isMobile]);

  const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Edit
    if (info.offset.x < -10) {
      setShowEdit(false);
    }

    if (info.offset.x > 200) {
      debounceEdit(!showEdit);
    }

    // Delete
    if (info.offset.x < -200) {
      debounceDelete(!showDelete);
    }

    if (info.offset.x > 10) {
      setShowDelete(false);
    }
  };

  const handleEdit = (): void => {
    onEditDream(dream.id);
    setShowEdit(false);
  };

  return (
    <div className="flex">
      {showEdit && isMobile && (
        <motion.div
          className="h-full flex justify-center self-center pb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button size="small" onClick={handleEdit}>
            <EditOutlined className="cursor-pointer" />
          </Button>
        </motion.div>
      )}
      <motion.div className="grow" drag={isMobile && 'x'} dragConstraints={{ left: 0, right: 0 }} onDrag={handleDrag}>
        <Card elevation={1} className="mb-5">
          <Stack direction="column">
            <Stack>
              <div className="flex justify-between">
                {/* Title */}
                <Typography className="text-xl sm:text-2xl md:text-3xl m-3 md:mb-0 line-clamp-1">
                  {dream.title}
                </Typography>
                {/* Actions here */}
                <div className="hidden md:flex">
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
                <Typography className="mt-5 text-md line-clamp-3">{dream.dream}</Typography>
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
      {showDelete && isMobile && (
        <motion.div
          className="h-full flex justify-center self-center pb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Button color="error" onClick={() => onDeleteDream(dream.id)}>
            <DeleteOutline className="cursor-pointer" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
