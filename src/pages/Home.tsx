import { ChangeEvent, SyntheticEvent, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EditOutlined, SearchOutlined, TuneOutlined, ArrowBackIosNewOutlined } from '@mui/icons-material';
import { Search } from '../shared/components/Search';
import { DreamCard } from '../components/dream/DreamCard';
import { DreamModal } from '../components/dream/DreamModal';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { Dream } from '../shared/models/dream';
import { useAppDispatch, useAppSelector } from '../core/store/hooks';
import { CalendarIcon } from '@mui/x-date-pickers';
import { useIsMobile } from '../shared/hooks/useIsMobile';
import { MobileFooter, MobileHeader } from '../core/models/constants';
import { AppContext } from '../core/context/AppContext';
import { Alert, Box, Button, Chip, Container, Portal, Snackbar } from '@mui/material';
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
import { CalendarDream } from '../components/dream/CalendarDream';
import { DeleteDream } from '../components/dream/DeleteDream';
import { FilterDream } from '../components/dream/FilterDream';
import { motion } from 'framer-motion';

export function Home() {
  const [isOpenDreamModal, setIsOpenDreamModal] = useState(false);
  const [isOpenCalendarDream, setIsOpenCalendarDream] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [isOpenFilter, setIsOpenFilter] = useState(false);

  const [date, setDate] = useState(moment());

  const [isSearching, setIsSearching] = useState(false);
  const [dreamId, setDreamId] = useState<string | null>(null);
  const [editDream, setEditDream] = useState<Dream | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState<'adding' | 'editing' | 'deleting'>('adding');

  const [deleteAbortController, setDeleteAbortController] = useState<AbortController | null>(null);

  const { isDarkMode } = useContext(AppContext);

  const { isLoading, httpGet, httpDelete } = useApi();
  const { isMobile } = useIsMobile();

  const dreams = useAppSelector((state) => state.dream.dreams);
  const displayDreams = useAppSelector((state) => state.dream.displayDreams);
  const filteredDreams = useAppSelector((state) => state.dream.filteredDreams);
  const displayFilteredDreams = useAppSelector((state) => state.dream.displayFilteredDreams);
  const filters = useAppSelector((state) => state.dream.filters);

  const writeRef = useRef<HTMLElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();

  // Used to get the Dream when deleting
  const dream = useMemo(() => dreams.find((d) => d.id === dreamId), [dreams, dreamId]);

  useEffect(() => {
    const writeDiv = document.getElementById('write');
    if (writeRef.current === null) {
      writeRef.current = writeDiv;
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    if (dreams.length === 0) {
      try {
        httpGet<ApiResponse<Dream[]>>('/dreams')
          .then((res) => {
            if (mounted) {
              dispatch(initializeDream(res.data));
            }
          })
          .catch((error) => console.log('Error:', error));
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
      setIsOpenCalendarDream(false);
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
      setIsOpenCalendarDream(false);
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
    setDeleteAbortController(new AbortController());
    setIsOpenDeleteDialog(true);
    setDreamId(id);
    setStatus('deleting');
  };

  const handleCancelDelete = (): void => {
    if (deleteAbortController) {
      deleteAbortController.abort();
    }
    setIsOpenDeleteDialog(false);
    setDeleteAbortController(null);
  };

  const handleOkDelete = (): void => {
    const signal = deleteAbortController?.signal;
    httpDelete<ApiResponse>('/dreams/' + dreamId, '', { signal })
      .then((res) => {
        if (res && res.success) {
          setIsOpenDeleteDialog(false);
          dispatch(removeDream(dreamId!));
          setShowAlert(true);
          setDreamId('');
        }
      })
      .catch((error) => console.log('Delete action cancelled'));
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const keyword = e.target.value.trim();
    dispatch(searchDream(keyword));
  };

  const handleOpenCalendar = (): void => {
    setDate(moment());
    setIsOpenCalendarDream(true);
  };

  const handleRemoveFilter = (e: SyntheticEvent<Element, Event>): void => {
    const target = e.target as HTMLButtonElement;
    console.log(target);
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

  console.log('filters', filters);

  return (
    <Container className="p-0 md:p-5">
      <motion.div
        drag={isMobile && 'y'}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ bottom: 0.1 }}
        dragMomentum={false}
        onDrag={(event, info) => console.log(info.offset.y)}
        dragPropagation={true}
        dragListener={true}
      >
        {/* Add dream using Calendar & Search */}
        {!isSearching && (
          <div className="flex justify-between items-center pt-20 pb-2 md:hidden">
            <div className="ms-5">
              <h4 className="m-0">My Dream Journal</h4>
            </div>
            <div>
              <Button onClick={handleOpenCalendar}>
                <CalendarIcon color="primary" />
              </Button>
              <Button onClick={handleToggleSearch}>
                <SearchOutlined color="primary" />
              </Button>
            </div>
          </div>
        )}

        {/* Search Entry & Filter CTA */}
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
            <Button onClick={() => setIsOpenFilter(true)}>
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
            <div className="flex md:justify-between mb-3">
              {/* Desktop create dream */}
              <div>
                {filters && filters.length > 0 && (
                  <div>
                    <span className="me-2">Applied Filters:</span>
                    {filters.map((f) =>
                      f.value ? (
                        <Chip
                          key={f.name}
                          label={f.name}
                          className="text-white me-2 mb-2"
                          onDelete={() => console.log('remove')}
                        />
                      ) : (
                        ''
                      )
                    )}
                  </div>
                )}
              </div>
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
          {writeRef.current && (
            <Portal
              children={
                <Fab className="fixed bottom-0 end-0 end-3 bottom-16" color="primary" onClick={handleWriteDreamOpen}>
                  <EditOutlined />
                </Fab>
              }
              container={writeRef.current}
            />
          )}
        </div>
      </motion.div>

      {/* Create dream using Calendar */}
      <CalendarDream
        isOpenCalendarDream={isOpenCalendarDream}
        onClose={() => setIsOpenCalendarDream(false)}
        onWriteDream={handleWriteDreamOpen}
        onEditDream={handleEditDream}
        onDeleteDream={handleDeleteDream}
        onDateChange={(e) => setDate(e)}
      />

      <FilterDream isOpenFilter={isOpenFilter} onClose={() => setIsOpenFilter(false)} />

      {/* Delete dreams confirmation */}
      <DeleteDream
        dream={dream}
        isOpenDeleteDream={isOpenDeleteDialog}
        isLoading={isLoading}
        onClose={() => setIsOpenDeleteDialog(false)}
        onCancel={handleCancelDelete}
        onOk={handleOkDelete}
      />

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
