import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { CircularProgress, Paper } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileFooter, NavHeader } from '../core/models/constants';
import { useIsMobile } from '../shared/hooks/useIsMobile';
import { motion, PanInfo } from 'framer-motion';
import { useAppSelector } from '../core/store/hooks';

export function BaseLayout() {
  const [showLoading, setShowLoading] = useState(false);
  const { isMobile } = useIsMobile();

  const dreams = useAppSelector((state) => state.dream.dreams);

  const offsetHeight = isMobile ? MobileFooter : NavHeader;

  const handleDrag = (info: PanInfo): void => {
    if (info.offset.y > 200) {
      setShowLoading(true);
    } else {
      setTimeout(() => {
        setShowLoading(false);
      }, 900);
    }
  };

  return (
    <>
      <Header />
      <Paper component="main" elevation={0} sx={{ minHeight: `calc(100vh - ${offsetHeight}px)`, borderRadius: 0 }}>
        {/* <motion.div
          drag={isMobile && 'y'}
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={{ bottom: 0.1 }}
          dragMomentum={false}
          onDrag={(event, info) => handleDrag(info)}
        > */}
          {/* <div className="flex justify-center absolute inset-x-0 top-4">
            <CircularProgress />
          </div> */}
          {/* {showLoading && (
            <div className="flex justify-center absolute inset-x-0 top-2">
              <CircularProgress />
            </div>
          )} */}
          <Outlet />
        {/* </motion.div> */}
      </Paper>
      <Footer />
    </>
  );
}
