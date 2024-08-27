import { Outlet } from 'react-router-dom';
import { Paper } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';

export function BaseLayout() {
  return (
    <>
      <Header />
      <Paper component="main" elevation={0} sx={{ height: '100%', borderRadius: 0 }}>
        <Outlet />
      </Paper>
      <Footer />
    </>
  );
}
