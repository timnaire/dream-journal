import { ChangeEvent, useEffect, useRef, useState } from 'react';
import {
  AutoStoriesOutlined,
  EditOutlined,
  SearchOutlined,
  TuneOutlined,
  ArrowBackIosNewOutlined,
} from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box, Button, Container, List, Paper } from '@mui/material';
import { Dream } from '../shared/components/Dream';
import { DreamModal } from '../shared/components/DreamModal';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { DreamModel } from '../shared/models/dream';
import { useAppDispatch, useAppSelector } from '../core/store/hooks';
import { CalendarIcon } from '@mui/x-date-pickers';
import { Modal } from '../shared/components/Modal';
import {
  initializeDream,
  addDream,
  updateDream,
  removeDream,
  searchDream,
  clearSearch,
} from '../core/store/dreams/dreamSlice';
import Fab from '@mui/material/Fab';
import { Search } from '../shared/components/Search';

export function Home() {
  const [isOpenDreamModal, setIsOpenDreamModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [dreamId, setDreamId] = useState<string>('');
  const [editDream, setEditDream] = useState<DreamModel | null>(null);
  const { httpGet, httpDelete } = useApi();
  const dreams = useAppSelector((state) => state.dream.dreams);
  const searched = useAppSelector((state) => state.dream.searchDreams);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useAppDispatch();
  const value = '';

  useEffect(() => {
    let mounted = true;

    if (dreams.length === 0) {
      try {
        httpGet<ApiResponse<DreamModel[]>>('/dreams').then((res) => {
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
  }, [dreams, dispatch, httpGet]);

  useEffect(() => {
    if (isSearching && searchRef.current) {
      searchRef.current.focus();
    } else {
      dispatch(clearSearch());
    }
  }, [isSearching, dispatch]);

  const dream = dreams.find((d) => d.id === dreamId);

  const handleWriteDreamOpen = (): void => setIsOpenDreamModal(true);
  const handleWriteDreamClose = (): void => setIsOpenDreamModal(false);
  const handleToggleSearch = (): void => setIsSearching(!isSearching);

  const handleDreamSaved = (dream: DreamModel): void => {
    if (editDream) {
      dispatch(updateDream(dream));
    } else {
      dispatch(addDream([dream]));
    }
    setEditDream(null);
  };

  const handleEditDream = (id: string) => {
    const dream = dreams.find((dream) => dream.id === id) || null;
    setEditDream(dream);
    setIsOpenDreamModal(true);
  };

  const handleDeleteDream = (id: string): void => {
    setIsOpenModal(true);
    setDreamId(id);
  };

  const handleOk = (): void => {
    setIsOpenModal(false);
    httpDelete<ApiResponse>('/dreams/' + dreamId).then((res) => {
      if (res.success) {
        dispatch(removeDream(dreamId));
      }
    });
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>): void => {
    const keyword = e.target.value.trim();
    dispatch(searchDream(keyword));
  };

  const dreamsContent =
    !isSearching &&
    dreams.length > 0 &&
    dreams.map((dream) => (
      <Dream key={dream.id} dream={dream} onEditDream={handleEditDream} onDeleteDream={handleDeleteDream} onShowActions={() => console.log('show controls')} />
    ));

  const searchedContent =
    searched.length > 0 &&
    searched.map((dream) => (
      <Dream key={dream.id} dream={dream} onEditDream={handleEditDream} onDeleteDream={handleDeleteDream} />
    ));
  console.log('dreams', dreams);

  return (
    <Container className="h-fit p-0 md:p-5">
      <div>
        {/* Filter */}

        {!isSearching && (
          <div className="flex justify-end mt-20 mb-2 md:hidden">
            <Button>
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

        <Box className="rounded-t-lg border-gray-200 p-5" sx={{ borderTop: { xs: 2, md: 0 } }}>
          <div className="flex justify-end mb-3">
            <Button className="hidden md:flex" variant="contained" onClick={handleWriteDreamOpen}>
              <EditOutlined className="me-2" /> Write a dream
            </Button>
          </div>

          {/* Dream entries */}
          <List>
            {isSearching && searched.length > 0 ? searchedContent : dreamsContent}
            {((dreams && dreams.length === 0) || (isSearching && searched.length === 0)) && (
              <p className="text-center">No dreams found.</p>
            )}
          </List>
        </Box>

        {/* Mobile */}
        <div className="md:hidden">
          <Fab
            className="fixed bottom-0 end-0 me-5 mb-20"
            color="primary"
            aria-label="add-dream"
            onClick={handleWriteDreamOpen}
          >
            <EditOutlined />
          </Fab>

          <div className="size-14"></div>
          <Paper className="fixed bottom-0 end-0 w-full" elevation={3}>
            <BottomNavigation value={value} onChange={(event, newValue) => console.log(newValue)}>
              <BottomNavigationAction label="Recents" icon={<TuneOutlined />} />
              <BottomNavigationAction label="Analyze" icon={<AutoStoriesOutlined />} />
              <BottomNavigationAction label="Archive" icon={<EditOutlined />} />
            </BottomNavigation>
          </Paper>
        </div>
      </div>

      <Modal isOpen={isOpenModal} handleClose={() => setIsOpenModal(false)} handleOk={handleOk}>
        <div className="font-bold text-2xl mb-3">Warning !</div>
        <div>
          Are you sure you want to continue? This dream <span className="font-bold">{dream && dream.title}</span> will
          be deleted.
        </div>
      </Modal>

      <DreamModal
        isOpen={isOpenDreamModal}
        editDream={editDream}
        writeDreamClose={handleWriteDreamClose}
        dreamSaved={handleDreamSaved}
      />
    </Container>
  );
}
