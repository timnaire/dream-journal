import { useContext } from 'react';
import { Avatar, Box, Card, Container, Typography } from '@mui/material';
import { AppContext } from '../core/context/AppContext';
import Grid from '@mui/material/Unstable_Grid2';

// const avatarStyle = {
//   width: '150px',
//   height: '150px',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   borderRadius: '50%',
//   fontSize: '70px',
//   backgroundColor: '#bdbdbd',
//   color: '#fff',
// };

export function Profile() {
  const { user } = useContext(AppContext);

  return (
    <Container sx={{ width: { xs: '100%', md: '60%' } }}>
      <Card sx={{ marginY: '25px', p: '12px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={user?.fullname} src="/static/images/avatar/1.jpg" sx={{ width: 56, height: 56 }} />
          <Box sx={{ flexGrow: 1 }}>
            <Typography sx={{ ml: '25px' }}>
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
    </Container>
  );
}
