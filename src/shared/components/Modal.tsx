import { Box, styled, Modal as MUIModal, Button } from "@mui/material";
import React from "react";

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
  children: React.ReactNode
}

export function Modal({ isOpen, children }: ModalProps) {
  return (
    <MUIModal open={isOpen} aria-describedby="modal">
      <ModalBox>
        {children}

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: '12px' }}>
          <Button variant="outlined" onClick={() => !isOpen} sx={{ mr: '6px' }}>
            Close
          </Button>
        </Box>
      </ModalBox>
    </MUIModal>
  );
}
