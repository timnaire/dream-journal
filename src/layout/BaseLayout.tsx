import { Outlet } from 'react-router-dom';
import { Paper } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileFooter, NavHeader } from '../core/models/constants';
import { useIsMobile } from '../shared/hooks/useIsMobile';

export function BaseLayout() {
  const { isMobile } = useIsMobile();

  const offsetHeight = isMobile ? MobileFooter : NavHeader;

  return (
    <>
      <Header />
      <Paper component="main" elevation={0} sx={{ minHeight: `calc(100vh - ${offsetHeight}px)`, borderRadius: 0 }}>
        <Outlet />
      </Paper>
      <Footer />
    </>
  );
}
