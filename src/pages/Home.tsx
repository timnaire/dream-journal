import { useContext, useEffect, useState } from 'react';
import { AutoStoriesOutlined, EditOutlined, TuneOutlined } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { Dream } from '../shared/components/Dream';
import { AppContext } from '../core/context/AppContext';
import { DreamModal } from '../shared/components/DreamModal';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { DreamModel } from '../shared/models/dream';
import { useAppDispatch, useAppSelector } from '../core/store/hooks';
import { CalendarIcon } from '@mui/x-date-pickers';
import { Modal } from '../shared/components/Modal';
import { initializeDream, addDream, updateDream, removeDream } from '../core/store/dreams/dreamSlice';
import Fab from '@mui/material/Fab';

export function Home() {
  const [isOpenDreamModal, setIsOpenDreamModal] = useState(false);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [dreamId, setDreamId] = useState<string>('');
  const [editDream, setEditDream] = useState<DreamModel | null>(null);
  const { user } = useContext(AppContext);
  const { httpGet, httpDelete } = useApi();
  const dreams = useAppSelector((state) => state.dream.dreams);
  const dispatch = useAppDispatch();

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
  }, [dreams]);

  const dream = dreams.find((d) => d.id === dreamId);

  const handleWriteDreamOpen = (): void => {
    setIsOpenDreamModal(true);
  };

  const handleWriteDreamClose = (): void => setIsOpenDreamModal(false);

  const handleEditDream = (id: string) => {
    const dream = dreams.find((dream) => dream.id === id) || null;
    setEditDream(dream);
    setIsOpenDreamModal(true);
  };

  const handleDeleteDream = (id: string) => {
    setIsOpenModal(true);
    setDreamId(id);
  };

  const handleDreamSaved = (dream: DreamModel): void => {
    if (editDream) {
      dispatch(updateDream(dream));
    } else {
      dispatch(addDream([dream]));
    }
    setEditDream(null);
  };

  const handleOk = (): void => {
    setIsOpenModal(false);
    httpDelete<ApiResponse>('/dreams/' + dreamId).then((res) => {
      if (res.success) {
        dispatch(removeDream(dreamId));
      }
    });
  };

  const dreamsContent =
    dreams.length > 0 &&
    dreams.map((dream) => (
      <Dream key={dream.id} dream={dream} editDream={handleEditDream} deleteDream={handleDeleteDream} />
    ));
  console.log('dreams', dreams);

  return (
    <Container className="h-fit p-0 md:p-5">
      <div>
        {/* Filter */}
        <div className="flex justify-end mt-20 mb-2 md:hidden">
          <Button>
            <AutoStoriesOutlined color="primary" />
          </Button>
          <Button>
            <CalendarIcon color="primary" />
          </Button>
          <Button>
            <TuneOutlined color="primary" />
          </Button>
        </div>
        <Box className="rounded-t-lg border-gray-200 p-5" sx={{ borderTop: { xs: 2, md: 0 } }}>
          <div>
            <Typography variant="h4">Hi welcome, {user?.firstname}</Typography>
          </div>

          <div className="flex justify-end mb-3">
            <Button className="hidden md:flex" variant="contained" onClick={handleWriteDreamOpen}>
              <EditOutlined className="me-2" /> Write a dream
            </Button>
          </div>

          {/* Dream entries */}
          {dreamsContent}
          {dreams && dreams.length === 0 && <p className="text-center">No dreams found.</p>}
        </Box>
      </div>

      <Modal isOpen={isOpenModal} handleClose={() => setIsOpenModal(false)} handleOk={handleOk}>
        <div className="font-bold text-2xl mb-3">Warning !</div>
        <div>
          Are you sure you want to continue? This dream <span className="font-bold">{dream && dream.title}</span> will
          be deleted.
        </div>
      </Modal>

      <Fab
        className="md:hidden fixed bottom-0 end-0 me-5 mb-5"
        color="primary"
        aria-label="add-dream"
        onClick={handleWriteDreamOpen}
      >
        <EditOutlined />
      </Fab>

      <DreamModal
        isOpen={isOpenDreamModal}
        editDream={editDream}
        writeDreamClose={handleWriteDreamClose}
        dreamSaved={handleDreamSaved}
      />
    </Container>
  );
}
