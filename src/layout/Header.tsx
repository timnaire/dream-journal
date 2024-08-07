import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Container,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { AutoStoriesOutlined } from '@mui/icons-material';
import { AppContext } from '../core/context/AppContext';
import { AvatarCard } from '../shared/components/AvatarCard';
import { useApi } from '../shared/hooks/useApi';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

export function Header() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const { user, setAppState } = useContext(AppContext);
  const { httpPost } = useApi();
  const navigation = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  const handleSignOut = (): void => {
    httpPost('/auth/sign-out', {}).then((res) => {
      setAppState({ isAuthenticated: false });
    });
  };

  const handleRoute = (href: string): void => {
    handleCloseUserMenu();
    navigation(href);
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Desktop */}
          <AutoStoriesOutlined sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
              cursor: 'pointer',
            }}
            onClick={() => handleRoute('/')}
          >
            Dream Journal
          </Typography>

          {/* To occupy space */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

          <AutoStoriesOutlined sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
            onClick={() => handleRoute('/')}
          >
            Dream Journal
          </Typography>

          {/* Profile */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Your profile and settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.fullname} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuList dense>
                <Box sx={{ px: '12px' }}>
                  <Box sx={{ mb: '6px', fontSize: '14px' }}>Account</Box>
                  <AvatarCard name={user?.fullname} nameVariant="caption" caption={user?.email} />
                </Box>
                <MenuItem onClick={() => handleRoute('/profile')}>
                  <ListItemText>Manage Account</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleSignOut}>
                  <ListItemText>Sign out</ListItemText>
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
