import { useContext } from 'react';
import { AppContext } from '../core/context/AppContext';
import { MobileFooter, MobileHeader } from '../core/models/constants';
import { useIsMobile } from '../shared/hooks/useIsMobile';
import { Box, Container } from '@mui/material';

export function Analysis() {
  const { isDarkMode } = useContext(AppContext);
  const { isMobile } = useIsMobile();

  return (
    <Container className="p-0 md:p-5">
      <div className="pt-20 pb-2 md:hidden">
        <div className="ms-5">
          <h3 className="m-0">Dream Analysis</h3>
        </div>
      </div>
      <Box
        className={`overflow-hidden md:overflow-visible rounded-t-lg ${isDarkMode ? 'border-gray-600' : 'border-gray-200'}`}
        sx={{ borderTop: { xs: 2, md: 0 } }}
      >
        <Box
          className={`${isMobile ? 'overflow-y-auto overflow-x-hidden md:overflow-y-hidden' : ''} p-5`}
          sx={{
            height: {
              xs: `calc(100vh - (${MobileHeader}px + ${MobileFooter}px))`,
              md: `100%`,
            },
          }}
        ></Box>
      </Box>
    </Container>
  );
}
