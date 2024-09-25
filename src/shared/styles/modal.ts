import { Box, styled } from '@mui/material';

export const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  width: 300,
  [theme.breakpoints.up('sm')]: { width: 500 },
  [theme.breakpoints.up('md')]: { width: 700 },
  padding: 14,
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius * 1,
}));
