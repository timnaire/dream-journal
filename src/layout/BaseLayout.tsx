import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';

export function BaseLayout() {
  return (
    <>
      <Header />
      <Box component="main" sx={{ height: '100%', backgroundColor: '#fdfdfd' }}>
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}
