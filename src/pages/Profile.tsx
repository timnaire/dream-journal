import { useContext } from 'react';
import { Avatar, Box, Button, Card, Container, Typography } from '@mui/material';
import { AppContext } from '../core/context/AppContext';
import { useApi } from '../shared/hooks/useApi';
import Grid from '@mui/material/Unstable_Grid2';

export function Profile() {
  const { user, setAppState } = useContext(AppContext);
  const { httpPost } = useApi();

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

      <Typography variant="h6">Recently favorite Dreams</Typography>
      <Grid container spacing={2} sx={{ mb: '10px' }}>
        {[0, 1, 2, 3].map((item) => (
          <Grid key={item} xs={12} sm={6} md={12} lg={6}>
            <Card sx={{ p: '10px' }}>Test dream here</Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6">Recently nightmare Dreams</Typography>
      <Grid container spacing={2} sx={{ mb: '10px' }}>
        {[0, 1, 2, 3].map((item) => (
          <Grid key={item} xs={12} sm={6} md={12} lg={6}>
            <Card sx={{ p: '10px' }}>Test dream here</Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6">Recently sleep paralysis Dreams</Typography>
      <Grid container spacing={2} sx={{ mb: '10px' }}>
        {[0, 1, 2, 3].map((item) => (
          <Grid key={item} xs={12} sm={6} md={12} lg={6}>
            <Card sx={{ p: '10px' }}>Test dream here</Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6">Recently Recurrent Dreams</Typography>
      <Grid container spacing={2} sx={{ mb: '10px' }}>
        {[0, 1, 2, 3].map((item) => (
          <Grid key={item} xs={12} sm={6} md={12} lg={6}>
            <Card sx={{ p: '10px' }}>Test dream here</Card>
          </Grid>
        ))}
      </Grid>

      <div className="md:hidden mb-5">
        <Button className="w-full" variant="outlined" color="error" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </Container>
  );
}
