import { useContext, useEffect, useState } from 'react';
import { Avatar, Box, Button, Card, CircularProgress, Container, Typography } from '@mui/material';
import { AppContext } from '../core/context/AppContext';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import Grid from '@mui/material/Unstable_Grid2';
import { Dream } from '../shared/models/dream';
import { useToFriendlyDate } from '../shared/hooks/useToFriendlyDate';

interface RecentDream {
  favorite: Dream[];
  nightmare: Dream[];
  paralysis: Dream[];
  recurrent: Dream[];
}

export function RecentDreamCard({ dream }: { dream: Dream }) {
  const createdAt = useToFriendlyDate(dream.createdAt!);
  return (
    <Card elevation={1}>
      <div className="flex justify-between">
        {/* Title */}
        <Typography
          className="text-md sm:text-lg md:text-xl m-3 mb-0 flex items-center w-full"
          sx={{ overflowWrap: 'anywhere' }}
        >
          <span className="w-full line-clamp-1">{dream.title}</span>
        </Typography>
      </div>
      <div className="p-3">
        <Typography className="text-xs">{createdAt}</Typography>
        <Typography className="text-sm mt-5 line-clamp-3 h-16" sx={{ overflowWrap: 'anywhere' }}>
          {dream.dream}
        </Typography>
      </div>
    </Card>
  );
}

export function Profile() {
  const [recentDreams, setRecentDreams] = useState<RecentDream | null>(null);
  const { user, setAppState } = useContext(AppContext);
  const { httpGet, httpPost, isLoading } = useApi();

  useEffect(() => {
    // TODO: Create a redux slice for this
    httpGet<ApiResponse<RecentDream>>('/dreams/recent-dreams')
      .then((res) => {
        if (res.success) {
          setRecentDreams(res.data);
        }
      })
      .catch((error) => console.log('Error:', error));
  }, []);

  const handleSignOut = (): void => {
    httpPost('/auth/sign-out', {})
      .then((res) => {
        setAppState({ isAuthenticated: false });
      })
      .catch((error) => console.log('Error:', error));
  };

  return (
    <Container sx={{ width: { xs: '100%', md: '60%' }, paddingY: '25px' }}>
      <Card sx={{ p: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={user?.fullname} src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ ml: '25px' }} className="text-xs sm:text-sm md:text-base">
              Name: {user?.fullname}
              <br />
              Email: {user?.email}
              <br />
            </Typography>
          </Box>
        </Box>
      </Card>

      <div className="flex justify-center items-center my-5">
        <hr className="grow bg-gray-600 border-0 rounded-l h-[3px]" />
        <Typography variant="h5" className="px-4">
          Your recent dreams
        </Typography>
        <hr className="grow bg-gray-600 border-0 rounded-lg h-[3px]" />
      </div>

      {isLoading && (
        <div className="flex justify-center mb-5">
          Getting recent dreams... <CircularProgress size={25} />
        </div>
      )}

      {!isLoading && (
        <>
          <Typography variant="h6" className="text-yellow-600">
            Favorites
          </Typography>
          <Grid container spacing={2} sx={{ mb: '10px' }}>
            {recentDreams &&
              recentDreams.favorite.map((item) => (
                <Grid key={item.id} xs={12} sm={6} md={12} lg={6}>
                  <RecentDreamCard dream={item} />
                </Grid>
              ))}
          </Grid>

          <Typography variant="h6" className="text-rose-600">
            Nightmares
          </Typography>
          <Grid container spacing={2} sx={{ mb: '10px' }}>
            {recentDreams &&
              recentDreams.nightmare.map((item) => (
                <Grid key={item.id} xs={12} sm={6} md={12} lg={6}>
                  <RecentDreamCard dream={item} />
                </Grid>
              ))}
          </Grid>

          <Typography variant="h6" className="text-fuchsia-600">
            Sleep Paralysis
          </Typography>
          <Grid container spacing={2} sx={{ mb: '10px' }}>
            {recentDreams &&
              recentDreams.paralysis.map((item) => (
                <Grid key={item.id} xs={12} sm={6} md={12} lg={6}>
                  <RecentDreamCard dream={item} />
                </Grid>
              ))}
          </Grid>

          <Typography variant="h6" className="text-green-600">
            Recurrent
          </Typography>
          <Grid container spacing={2} sx={{ mb: '10px' }}>
            {recentDreams &&
              recentDreams.recurrent.map((item) => (
                <Grid key={item.id} xs={12} sm={6} md={12} lg={6}>
                  <RecentDreamCard dream={item} />
                </Grid>
              ))}
          </Grid>
        </>
      )}

      <div className="md:hidden mb-5">
        <Button className="w-full" variant="outlined" color="error" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </Container>
  );
}
