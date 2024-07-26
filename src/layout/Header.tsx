import { useContext, useState } from 'react';
import { Avatar, Button, Container, Divider, Drawer, IconButton, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Toolbar, Tooltip, Typography } from '@mui/material';
import { ArchiveOutlined, AutoStoriesOutlined, LibraryBooksOutlined } from '@mui/icons-material';
import { AppContext } from '../core/context/AppContext';
import { AvatarCard } from '../shared/components/AvatarCard';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import MenuIcon from '@mui/icons-material/Menu';
import { useApi } from '../shared/hooks/useApi';
import { Navigate, useNavigate } from 'react-router-dom';

export function Header() {
    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
    const [open, setOpen] = useState(false);
    const { isAuthenticated, setAppState } = useContext(AppContext);
    const { httpPost } = useApi();
    const navigation = useNavigate();

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const toggleDrawer = (newOpen: any) => () => {
        setOpen(newOpen);
    };

    const handleSignOut = () => {
        httpPost('/auth/sign-out', {}).then(res => {
            console.log('called me second');
            localStorage.removeItem('isAuthenticated');
            setAppState({ isAuthenticated: false });
        });
    }

    const handleRoute = (href: string) => {
        handleCloseUserMenu();
        navigation(href);
    };

    // If user is already authenticated redirect to the main page
    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />
    }

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
                            cursor: 'pointer'
                        }}
                        onClick={() => handleRoute('/')}
                    >
                        Dream Journal
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {/* <Button sx={{ my: 2, color: 'white', display: 'block' }} >Collection</Button>
                        <Button sx={{ my: 2, color: 'white', display: 'block' }} >Archived</Button> */}
                    </Box>

                    {/* Mobile */}
                    {/* <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="mobile menu"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={toggleDrawer(true)}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer open={open} onClose={toggleDrawer(false)}>
                            <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon><LibraryBooksOutlined color="primary" /></ListItemIcon>
                                            <Link href="/collections" underline="none">Collections</Link>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon><ArchiveOutlined color="primary" /></ListItemIcon>
                                            <Link href="/archived" underline="none">Archived</Link>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>
                        </Drawer>
                    </Box> */}

                    <AutoStoriesOutlined sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
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
                    >
                        Dream Journal
                    </Typography>

                    {/* Profile */}
                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip title="Your profile and settings">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="User name" src="/static/images/avatar/2.jpg">TD</Avatar>
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
                                    <AvatarCard name="Timmy Donaire" nameVariant="caption" caption="timmydonaire@gmail.com" />
                                </Box>
                                <MenuItem onClick={() => handleRoute('/profile')}>
                                    <ListItemText>
                                        Manage Account
                                    </ListItemText>
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleSignOut}>
                                    <ListItemText>
                                        Sign out
                                    </ListItemText>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
