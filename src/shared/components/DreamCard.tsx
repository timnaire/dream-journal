import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  Chip,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Modal,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { DeleteOutline, EditOutlined, StarBorderOutlined, StarOutlined } from '@mui/icons-material';
import { Dream } from '../models/dream';
import { useToFriendlyDate } from '../hooks/useToFriendlyDate';
import { motion } from 'framer-motion';
import { useIsMobile } from '../hooks/useIsMobile';
import { ApiResponse, useApi } from '../hooks/useApi';
import { S3Service } from '../services/s3.service';

export interface DreamCardProps {
  isSimpleView?: boolean;
  dream: Dream;
  onEditDream?: (id: string) => void;
  onDeleteDream?: (id: string) => void;
}

export function DreamCard({ isSimpleView = false, dream, onEditDream, onDeleteDream }: DreamCardProps) {
  const [favorite, setFavorite] = useState(dream.favorite);
  const [openDialog, setOpenDialog] = useState(false);
  const [openImage, setOpenImage] = useState(false);
  const [dreamImage, setDreamImage] = useState<string | null>(null);
  const { isMobile } = useIsMobile();
  const { httpPut } = useApi();
  const createdAt = useToFriendlyDate(dream.createdAt ? dream.createdAt : new Date(), true);
  const debounceFavorite = debounce((favorite) => {
    httpPut<ApiResponse>('/dreams', { ...dream, favorite: favorite })
      .then((res) => {
        if (res && res.success) {
          setFavorite(favorite);
        }
      })
      .catch((error) => console.log('Error:', error));
  }, 200);

  const s3 = new S3Service();

  const handleEdit = (): void => {
    if (onEditDream) {
      onEditDream(dream.id!);
    }
  };

  const handleDelete = (): void => {
    if (onDeleteDream) {
      onDeleteDream(dream.id!);
    }
  };

  const handleToggleFavorite = (): void => {
    debounceFavorite(!favorite);
  };

  const handleClick = async () => {
    setOpenDialog(true);

    if (!dreamImage && dream.image?.filename) {
      const image = await s3.get(dream.image?.filename);
      const prefix = `data:${image.ContentType};base64, `;
      // Use base64 encoding
      const base64Image = (await image.Body?.transformToString('base64')) || null;
      setDreamImage(prefix + base64Image);
    }
  };

  const handleOpenImage = (): void => {
    setOpenImage(true);
  };

  const recurrent = dream.recurrent && <Chip label="Recurrent" className="bg-green-600 text-white me-2 mb-2" />;
  const nightmare = dream.nightmare && <Chip label="Nightmare" className="bg-rose-600 text-white me-2 mb-2" />;
  const paralysis = dream.paralysis && <Chip label="Paralysis" className="bg-fuchsia-600 text-white me-2 mb-2" />;

  return (
    <div className="flex relative mb-5">
      <motion.div
        className="grow z-10 md:!translate-x-0"
        drag={isMobile && 'x'}
        dragConstraints={{ left: -120, right: 0 }}
        dragElastic={false}
        dragMomentum={false}
      >
        <Card elevation={1}>
          <Stack className="cursor-pointer">
            <div className="flex justify-between">
              {/* Title */}
              <Typography
                className="text-lg sm:text-xl md:text-2xl m-3 mb-0 line-clamp-1 flex items-center w-full"
                sx={{ overflowWrap: 'anywhere' }}
              >
                <Tooltip title="Favorite" placement="left-start">
                  <IconButton className="me-1 mb-1" onClick={handleToggleFavorite}>
                    {favorite && <StarOutlined className="text-yellow-300" />}
                    {!favorite && <StarBorderOutlined className="text-yellow-300" />}
                  </IconButton>
                </Tooltip>
                <span className="w-full" onClick={handleClick}>
                  {dream.title}
                </span>
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
            <div className="p-3" onClick={handleClick}>
              <Typography className={`text-xs ${isSimpleView && 'hidden'}`}>{createdAt}</Typography>
              <Typography
                className={`text-md ${isSimpleView ? 'line-clamp-2' : 'mt-5 line-clamp-3'}`}
                sx={{ overflowWrap: 'anywhere' }}
              >
                {dream.dream}
              </Typography>
              <div className={`mt-3 line-clamp-2 ${isSimpleView && 'hidden'}`}>
                {recurrent}
                {nightmare}
                {paralysis}
              </div>
            </div>
          </Stack>
        </Card>
      </motion.div>

      {/* Action */}
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

      {/* View Dream */}
      <Dialog open={openDialog} fullWidth={true} maxWidth="md" onClose={() => setOpenDialog(false)}>
        <DialogTitle>{dream.title}</DialogTitle>
        <DialogContent>
          <div>{createdAt}</div>

          {/* To support future use of rich text editor */}
          <div dangerouslySetInnerHTML={{ __html: dream.dream }}></div>

          <div className="block mt-3">
            {recurrent}
            {nightmare}
            {paralysis}
          </div>

          {dreamImage && (
            <div role="img" aria-label="Dream image">
              <img src={dreamImage} alt="the dream" height="50px" width="50px" onClick={handleOpenImage} />
            </div>
          )}
          {dream.image?.filename && !dreamImage && <div className="flex justify-center">Loading image...</div>}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Modal open={openImage} onClose={() => setOpenImage(false)} aria-labelledby="The Dream Image">
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '100%', md: '65%', lg: '85%' },
          }}
        >
          <div className="px-5">
            {dreamImage && <img src={dreamImage} alt="the dream" height="100%" width="100%" />}
          </div>
        </Box>
      </Modal>
    </div>
  );
}
