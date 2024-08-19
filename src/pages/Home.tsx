import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { EditOutlined, SearchOutlined, TuneOutlined, ArrowBackIosNewOutlined, Close } from '@mui/icons-material';
import { Search } from '../shared/components/Search';
import { Transition } from '../shared/components/Transition';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DreamCard } from '../shared/components/DreamCard';
import { DreamModal } from '../shared/components/DreamModal';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { Dream } from '../shared/models/dream';
import { useAppDispatch, useAppSelector } from '../core/store/hooks';
import { CalendarIcon, DateCalendar, LocalizationProvider } from '@mui/x-date-pickers';
import { useIsMobile } from '../shared/hooks/useIsMobile';
import {
  Alert,
  AppBar,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Snackbar,
  Toolbar,
  Typography,
} from '@mui/material';
import {
  initializeDream,
  addDream,
  updateDream,
  removeDream,
  searchDream,
  clearSearch,
} from '../core/store/dreams/dreamSlice';
import Fab from '@mui/material/Fab';
import moment from 'moment';

export function Home() {
  const [isOpenDreamModal, setIsOpenDreamModal] = useState(false);
  const [isOpenDreamCalendar, setIsOpenDreamCalendar] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);

  const [date, setDate] = useState(moment());
  const [isSearching, setIsSearching] = useState(false);
  const [dreamId, setDreamId] = useState<string | null>(null);
  const [editDream, setEditDream] = useState<Dream | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState<'adding' | 'editing' | 'deleting'>('adding');

  const { httpGet, httpDelete } = useApi();
  const { isMobile } = useIsMobile();

  const dreams = useAppSelector((state) => state.dream.dreams);
  const searchedItems = useAppSelector((state) => state.dream.searchDreams);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  const dream = dreams.find((d) => d.id === dreamId);

  useEffect(() => {
    let mounted = true;

    if (dreams.length === 0) {
      try {
        httpGet<ApiResponse<Dream[]>>('/dreams').then((res) => {
          if (mounted) {
            dispatch(initializeDream(res.data));
          }
        });
      } catch (error) {
        console.error('error:', error);
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsOpenDreamCalendar(false);
    }
  }, [isMobile]);

  const handleWriteDreamOpen = (): void => {
    setIsOpenDreamModal(true);
    setEditDream(null);
    setStatus('adding');
  };
  const handleWriteDreamClose = (): void => setIsOpenDreamModal(false);

  const handleToggleSearch = (): void => {
    setIsSearching(!isSearching);
    if (isSearching && searchRef.current) {
      searchRef.current.focus();
    } else {
      dispatch(clearSearch());
    }
  };

  const handleDreamSaved = (dream: Dream): void => {
    if (editDream) {
      dispatch(updateDream(dream));
    } else {
      dispatch(addDream([dream]));
      setIsOpenDreamCalendar(false);
      setDate(moment());
    }
    setShowAlert(true);
  };

  const handleEditDream = (id: string): void => {
    const dream = dreams.find((dream) => dream.id === id) || null;
    setEditDream(dream);
    setIsOpenDreamModal(true);
    setStatus('editing');
  };

  const handleDeleteDream = (id: string): void => {
    setIsOpenDeleteDialog(true);
    setDreamId(id);
    setStatus('deleting');
  };

  const handleOk = (): void => {
    setIsOpenDeleteDialog(false);
    httpDelete<ApiResponse>('/dreams/' + dreamId).then((res) => {
      if (res.success) {
        dispatch(removeDream(dreamId!));
        setShowAlert(true);
      }
    });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const keyword = e.target.value.trim();
    dispatch(searchDream(keyword));
  };

  const handleOpenCalendar = (): void => {
    setDate(moment());
    setIsOpenDreamCalendar(true);
  };

  const dreamsContent =
    !isSearching &&
    dreams.length > 0 &&
    dreams.map((dream) => (
      <DreamCard key={dream.id} dream={dream} onEditDream={handleEditDream} onDeleteDream={handleDeleteDream} />
    ));

  const searchedContent =
    searchedItems.length > 0 &&
    searchedItems.map((dream) => (
      <DreamCard key={dream.id} dream={dream} onEditDream={handleEditDream} onDeleteDream={handleDeleteDream} />
    ));

  console.log('dreams', dreams);

  return (
    <Container className="h-fit p-0 md:p-5">
      <div>
        {/* Search & Filters */}
        {!isSearching && (
          <div className="flex justify-end pt-20 pb-2 md:hidden sticky">
            <Button onClick={handleOpenCalendar}>
              <CalendarIcon color="primary" />
            </Button>
            <Button onClick={handleToggleSearch}>
              <SearchOutlined color="primary" />
            </Button>
          </div>
        )}

        {isSearching && (
          <div className="flex justify-end items-center mt-20 mb-2 md:hidden">
            <Button onClick={handleToggleSearch}>
              <ArrowBackIosNewOutlined color="primary" />
            </Button>
            <div className="grow">
              <Search
                ref={searchRef}
                placeholder={`Search in ${dreams.length} dream${dreams.length > 0 ? 's' : ''}`}
                onSearch={handleSearch}
              />
            </div>
            <Button onClick={() => console.log('Filter settings')}>
              <TuneOutlined color="primary" />
            </Button>
          </div>
        )}

        <Box className="overflow-hidden rounded-t-lg border-gray-200 p-5" sx={{ borderTop: { xs: 2, md: 0 } }}>
          <div className="flex justify-end mb-3">
            {/* Desktop create dream */}
            <Button className="hidden md:flex" variant="contained" onClick={handleWriteDreamOpen}>
              <EditOutlined className="me-2" /> Write a dream
            </Button>
          </div>

          {/* List of Dreams */}
          {isSearching && searchedItems.length > 0 ? searchedContent : dreamsContent}
          {((dreams && dreams.length === 0) || (isSearching && searchedItems.length === 0)) && (
            <p className="text-center">No dreams found.</p>
          )}
        </Box>

        {/* Mobile create dream */}
        <div className="md:hidden">
          <Fab className="fixed bottom-0 end-0 end-3 bottom-16" color="primary" onClick={handleWriteDreamOpen}>
            <EditOutlined />
          </Fab>
        </div>
      </div>

      {/* Create dream using Calendar */}
      <Dialog
        fullScreen
        open={isOpenDreamCalendar}
        onClose={() => setIsOpenDreamCalendar(false)}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={() => setIsOpenDreamCalendar(false)} aria-label="close">
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Calendar
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent className="p-0">
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DateCalendar value={date} onChange={(e) => setDate(e!)} disableFuture={true} />
          </LocalizationProvider>
          <div className="flex justify-center">
            <Button variant="contained" onClick={handleWriteDreamOpen}>
              Add Dream
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete dreams confirmation */}
      <Dialog open={isOpenDeleteDialog} onClose={() => setIsOpenDeleteDialog(false)}>
        <DialogTitle>Warning !</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to continue? This dream <span className="font-bold">{dream && dream.title}</span> will
            be deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsOpenDeleteDialog(false)}>Close</Button>
          <Button variant="contained" onClick={handleOk}>
            Okay
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Dreams */}
      <DreamModal
        key={editDream ? editDream?.id : date.toISOString()}
        isOpen={isOpenDreamModal}
        initialDate={date}
        editDream={editDream}
        onWriteDreamClose={handleWriteDreamClose}
        onDreamSaved={handleDreamSaved}
      />

      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
      >
        <Alert severity="success" variant="filled">
          Dream {status === 'adding' && 'logged'} {status === 'editing' && 'updated'}
          {status === 'deleting' && 'deleted'} successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
}
