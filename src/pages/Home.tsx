import { ChangeEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EditOutlined, SearchOutlined, TuneOutlined, ArrowBackIosNewOutlined } from '@mui/icons-material';
import { Search } from '../shared/components/Search';
import { DreamCard } from '../shared/components/DreamCard';
import { DreamModal } from '../shared/components/DreamModal';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { Dream } from '../shared/models/dream';
import { useAppDispatch, useAppSelector } from '../core/store/hooks';
import { CalendarIcon } from '@mui/x-date-pickers';
import { useIsMobile } from '../shared/hooks/useIsMobile';
import { MobileFooter, MobileHeader } from '../core/models/constants';
import { AppContext } from '../core/context/AppContext';
import { DreamCalendar } from '../shared/components/DreamCalendar';
import {
  Alert,
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
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

  const { isDarkMode } = useContext(AppContext);

  const { httpGet, httpDelete } = useApi();
  const { isMobile } = useIsMobile();

  const dreams = useAppSelector((state) => state.dream.dreams);
  const displayDreams = useAppSelector((state) => state.dream.displayDreams);
  const filteredDreams = useAppSelector((state) => state.dream.filteredDreams);
  const displayFilteredDreams = useAppSelector((state) => state.dream.displayFilteredDreams);

  const searchRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  // Used to get the Dream when deleting
  const dream = useMemo(() => dreams.find((d) => d.id === dreamId), [dreams, dreamId]);

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
      setIsSearching(false);
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
    Object.entries(displayDreams).map(([month, dreams]) => {
      return (
        <div key={month}>
          <div className="text-lg sm:text-xl md:text-2xl ms-1 mb-3">{month}</div>
          {dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} onEditDream={handleEditDream} onDeleteDream={handleDeleteDream} />
          ))}
        </div>
      );
    });

  const filteredContent =
    filteredDreams.length > 0 &&
    Object.entries(displayFilteredDreams).map(([month, dreams]) => {
      return (
        <div key={month}>
          <div className="text-lg sm:text-xl md:text-2xl ms-1 mb-3">{month}</div>
          {dreams.map((dream) => (
            <DreamCard key={dream.id} dream={dream} onEditDream={handleEditDream} onDeleteDream={handleDeleteDream} />
          ))}
        </div>
      );
    });

  console.log('dreams', dreams);

  return (
    <Container className="p-0 md:p-5">
      <div>
        {/* Search & Filters */}
        {!isSearching && (
          <div className="flex justify-end pt-20 pb-2 md:hidden">
            <Button onClick={handleOpenCalendar}>
              <CalendarIcon color="primary" />
            </Button>
            <Button onClick={handleToggleSearch}>
              <SearchOutlined color="primary" />
            </Button>
          </div>
        )}

        {isSearching && (
          <div className="flex justify-end items-center pt-20 pb-2">
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
            <div className="flex justify-end mb-3">
              {/* Desktop create dream */}
              <Button className="hidden md:flex" variant="contained" onClick={handleWriteDreamOpen}>
                <EditOutlined className="me-2" /> Write a dream
              </Button>
            </div>

            {/* List of Dreams */}
            {isSearching && filteredDreams.length > 0 ? filteredContent : dreamsContent}
            {((dreams && dreams.length === 0) || (isSearching && filteredDreams.length === 0)) && (
              <p className="text-center">No dreams found.</p>
            )}
          </Box>
        </Box>

        {/* Mobile create dream */}
        <div className="md:hidden">
          <Fab className="fixed bottom-0 end-0 end-3 bottom-16" color="primary" onClick={handleWriteDreamOpen}>
            <EditOutlined />
          </Fab>
        </div>
      </div>

      {/* Create dream using Calendar */}
      <DreamCalendar
        isOpenDreamCalendar={isOpenDreamCalendar}
        onClose={() => setIsOpenDreamCalendar(false)}
        onWriteDream={handleWriteDreamOpen}
        onEditDream={handleEditDream}
        onDeleteDream={handleDeleteDream}
        onDateChange={(e) => setDate(e)}
      />

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
      {isOpenDreamModal && (
        <DreamModal
          isOpen={isOpenDreamModal}
          initialDate={date}
          editDream={editDream}
          onWriteDreamClose={handleWriteDreamClose}
          onDreamSaved={handleDreamSaved}
        />
      )}

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
