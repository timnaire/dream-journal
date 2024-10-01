import { useContext, useState } from 'react';
import { AppContext } from '../core/context/AppContext';
import { MobileFooter, MobileHeader } from '../core/models/constants';
import { useIsMobile } from '../shared/hooks/useIsMobile';
import { Transition } from '../shared/components/Transition';
import { ArrowBackIosOutlined } from '@mui/icons-material';
import { AppBar, Box, Container, Dialog, DialogContent, IconButton, Toolbar, Typography } from '@mui/material';
import { DreamAndSleep, LucidDreaming } from '../core/models/learn';


export function Learn() {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [item, setItem] = useState<any>(null);
  const { isDarkMode } = useContext(AppContext);
  const { isMobile } = useIsMobile();

  const handleClick = (item: any): void => {
    setIsOpenDialog(true);
    setItem(item);
  };

  const handleClose = (): void => {
    setIsOpenDialog(false);
    setItem(null);
  };

  return (
    <>
      <Container className="p-0 md:p-5">
        <div className="pt-20 pb-2 md:hidden">
          <div className="ms-5">
            <h3 className="m-0">Learn</h3>
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
          >
            <section>
              <h3>Dream & Sleep</h3>
              <div className="flex gap-5">
                {DreamAndSleep.map((item) => (
                  <div key={item.title} role="button" className="flex flex-col w-28" onClick={() => handleClick(item)}>
                    <img className="rounded-lg" src={item.imageUrl} alt={item.title} />
                    <div className="text-sm mt-2">{item.title}</div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h3>Lucid Dreaming</h3>
              <div className="flex gap-5">
                {LucidDreaming.map((item) => (
                  <div key={item.title} role="button" className="flex flex-col w-28" onClick={() => handleClick(item)}>
                    <img className="rounded-lg" src={item.imageUrl} alt={item.title} />
                    <div className="text-sm mt-2">{item.title}</div>
                  </div>
                ))}
              </div>
            </section>
          </Box>
        </Box>
      </Container>

      {item && <LearnDialog item={item} isOpen={isOpenDialog} onClose={handleClose} />}
    </>
  );
}

export function LearnDialog({ item, isOpen, onClose }: { item: any; isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog fullScreen open={isOpen} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <ArrowBackIosOutlined />
          </IconButton>
          <Typography variant="h6" component="div">
            {item?.title}
          </Typography>
        </Toolbar>
      </AppBar>
      <DialogContent className="p-0">
        <div className="h-full p-3">
          <div className="flex flex-col">
            <img className="px-3" src={item.imageUrl} alt={item.title} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: item?.description }}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
