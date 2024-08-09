import { useContext, useEffect, useState } from 'react';
import { EditOutlined } from '@mui/icons-material';
import { Box, Button, Container, Typography } from '@mui/material';
import { Dream } from '../shared/components/Dream';
import { AppContext } from '../core/context/AppContext';
import { Loading } from '../shared/components/Loading';
import { DreamModal } from '../shared/components/DreamModal';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { DreamModel } from '../shared/models/dream';
import { useAppDispatch, useAppSelector } from '../core/store/hooks';
import { addDream } from '../core/store/dreams/dreamSlice';

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
    <Container className="h-fit">
      <Box
        sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', overflow: 'hidden', p: 3 }}
      >
        <Box sx={{ display: 'flex', py: '10px', width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
          <Typography variant="h4">Hi welcome, {user?.firstname}</Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'end',
            py: '10px',
            width: { xs: '100%', sm: '80%', md: '60%' },
            mb: '25px',
          }}
        >
          <Button variant="contained" onClick={handleWriteDreamOpen}>
            <EditOutlined sx={{ mr: '6px' }} /> Write a dream
          </Button>
        </Box>

        {/* Dream entries */}
        {dreamsContent}
        {dreams && dreams.length === 0 && <p>No dreams found.</p>}
      </Box>

      <DreamModal
        isOpen={isOpen}
        editDream={editDream}
        writeDreamClose={handleWriteDreamClose}
        dreamSaved={handleDreamAdded}
      />
    </Container>
  );
}
