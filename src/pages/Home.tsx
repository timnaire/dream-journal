import { useContext, useEffect, useState } from 'react';
import { AutoStoriesOutlined, EditOutlined, TuneOutlined } from '@mui/icons-material';
import { Box, Button, Card, Container, Stack, Typography } from '@mui/material';
import { Dream } from '../shared/components/Dream';
import { AppContext } from '../core/context/AppContext';
import { DreamModal } from '../shared/components/DreamModal';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { DreamModel } from '../shared/models/dream';
import { useAppDispatch, useAppSelector } from '../core/store/hooks';
import { addDream } from '../core/store/dreams/dreamSlice';
import Fab from '@mui/material/Fab';
import { CalendarIcon } from '@mui/x-date-pickers';

export function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [editDream, setEditDream] = useState<DreamModel | null>(null);
  const { user } = useContext(AppContext);
  const { httpGet, httpDelete } = useApi();
  const dreams = useAppSelector((state) => state.dream.dreams);
  const dispatch = useAppDispatch();

  useEffect(() => {
    getDreams();
  }, []);

  const handleWriteDreamOpen = (): void => {
    setEditDream(null);
    setIsOpen(true);
  };
  const handleWriteDreamClose = (): void => setIsOpen(false);

  const getDreams = (): void => {
    if (dreams.length === 0) {
      httpGet<ApiResponse<DreamModel[]>>('/dreams').then((res) => {
        dispatch(addDream(res.data));
      });
    }
  };

  const handleEditDream = (id: string) => {
    const dream = dreams.find((dream) => dream.id === id) || null;
    setEditDream(dream);
    setIsOpen(true);
  };

  const handleDeleteDream = (id: string) => {
    httpDelete<ApiResponse>('/dreams/' + id).then((res) => {
      if (res.success) {
        getDreams();
      }
    });
  };

  const handleDreamAdded = (): void => {
    getDreams();
  };

  const dreamsContent =
    dreams &&
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

      <Fab
        className="md:hidden fixed bottom-0 end-0 me-5 mb-5"
        color="primary"
        aria-label="add-dream"
        onClick={handleWriteDreamOpen}>
        <EditOutlined />
      </Fab>

      <DreamModal
        isOpen={isOpen}
        editDream={editDream}
        writeDreamClose={handleWriteDreamClose}
        dreamSaved={handleDreamAdded}
      />
    </Container>
  );
}
