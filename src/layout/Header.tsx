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
  useMediaQuery,
} from '@mui/material';
import { AutoStoriesOutlined, DarkModeOutlined, DesktopWindowsOutlined, LightModeOutlined } from '@mui/icons-material';
import { AppContext } from '../core/context/AppContext';
import { AvatarCard } from '../shared/components/AvatarCard';
import { useApi } from '../shared/hooks/useApi';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';

export function Header() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const [anchorElTheme, setAnchorElTheme] = useState<null | HTMLElement>(null);
  const { user, isDarkMode, setAppState } = useContext(AppContext);
  const { httpPost } = useApi();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const navigation = useNavigate();

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = (): void => {
    setAnchorElUser(null);
  };

  const handleOpenThemeMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorElTheme(event.currentTarget);
  };

  const handleCloseThemeMenu = (): void => {
    setAnchorElTheme(null);
  };

  const handleChangeTheme = (isDarkMode: boolean): void => {
    setAppState({ isDarkMode });
    localStorage.setItem('isDarkMode', String(isDarkMode));
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
    <AppBar position="sticky" className="hidden md:flex top-0">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AutoStoriesOutlined className="me-3" />
          <Typography className="text-xl font-bold tracking-widest cursor-pointer" onClick={() => handleRoute('/')}>
            Dream Journal
          </Typography>

          {/* To occupy space */}
          <Box sx={{ flexGrow: 1 }}></Box>

          {/* Profile */}
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Theme Mode" className="me-3">
              <IconButton onClick={handleOpenThemeMenu}>
                {isDarkMode ? <DarkModeOutlined /> : <LightModeOutlined />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Your profile and settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.fullname} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>

            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElTheme}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElTheme)}
              onClose={handleCloseThemeMenu}
            >
              <MenuList dense>
                <MenuItem sx={{ width: '125px' }} onClick={() => handleChangeTheme(false)}>
                  <LightModeOutlined sx={{ marginRight: '8px' }} />
                  Light
                </MenuItem>
                <MenuItem onClick={() => handleChangeTheme(true)}>
                  <DarkModeOutlined sx={{ marginRight: '8px' }} /> Dark
                </MenuItem>
                <MenuItem onClick={() => handleChangeTheme(prefersDarkMode)}>
                  <DesktopWindowsOutlined sx={{ marginRight: '8px' }} /> System
                </MenuItem>
              </MenuList>
            </Menu>

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
