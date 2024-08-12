import { Box, styled, Modal as MuiModal, Button } from '@mui/material';
import React from 'react';

export const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  width: 300,
  [theme.breakpoints.up('sm')]: { width: 500 },
  [theme.breakpoints.up('md')]: { width: 700 },
  padding: 14,
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius * 1,
}));

interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  handleOk: () => void;
  children: React.ReactNode;
}

export function Modal({ isOpen, handleClose, handleOk, children }: ModalProps) {
  return (
    <MuiModal open={isOpen} aria-describedby="modal">
      <ModalBox>
        {children}

        {/* Actions */}
        <Box className="flex justify-end mt-5 pt-5 border-gray-200" sx={{ borderTop: 1 }}>
          <Button variant="outlined" onClick={handleClose} sx={{ mr: '6px' }}>
            Close
          </Button>
          <Button variant="contained" onClick={handleOk} sx={{ mr: '6px' }}>
            Okay
          </Button>
        </Box>
      </ModalBox>
    </MuiModal>
  );
}
