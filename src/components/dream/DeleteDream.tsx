import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { Dream } from '../../shared/models/dream';

interface DreamProps {
  dream?: Dream;
  isOpenDeleteDream: boolean;
  isLoading: boolean;
  onClose?: () => void;
  onCancel: () => void;
  onOk: () => void;
}

export function DeleteDream({ dream, isOpenDeleteDream, isLoading, onClose, onCancel, onOk }: DreamProps) {
  return (
    <Dialog open={isOpenDeleteDream} onClose={onClose}>
      <DialogTitle>Warning !</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to continue? This dream <span className="font-bold">{dream && dream.title}</span> will
          be deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button variant="contained" onClick={onOk} disabled={isLoading}>
          {isLoading ? <CircularProgress size={25} /> : 'Okay'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
