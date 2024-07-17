import { useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { Box, Button, Container, InputAdornment, Link, Paper, TextField, Typography } from "@mui/material";
import { AccountCircleOutlined, KeyOutlined } from "@mui/icons-material";
import { AppContext } from "../core/context/AppContext";


export function SignIn() {
    const { isAuthenticated, setAppState } = useContext(AppContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // If user is already authenticated redirect to the main page
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleSignin = () => {
        // TODO: implement sign in
        if (username === 'admin' && password === 'test1234') {
            localStorage.setItem('isAuthenticated', 'true');
            setAppState({ isAuthenticated: true });
            setUsername('');
            setPassword('');
        }
    }

    return (
        <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <Box component={Paper} sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '80%', md: '50%', lg: '30%' }, padding: '25px' }}>
                <Typography variant="h3" component="h3" >
                    Dream Journal
                </Typography>
                <Box component="span" sx={{ paddingLeft: '3px', marginBottom: '32px', fontSize: '12px' }}>
                    Don't have an account? Click here to&nbsp;
                    <Link href="/sign-up" underline="none">

                        Sign Up
                    </Link>
                </Box>

                <TextField
                    value={username}
                    type="text"
                    label="Username"
                    variant="standard"
                    sx={{ marginBottom: '25px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircleOutlined />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    value={password}
                    type="password"
                    label="Password"
                    variant="standard"
                    sx={{ marginBottom: '25px' }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <KeyOutlined />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button variant="contained" onClick={handleSignin}>Sign in</Button>
                <Box component="span" sx={{ textAlign: 'center', marginTop: '10px', fontSize: '12px' }}>
                    Forgot your password?&nbsp;
                    <Link href="/forgot-password" underline="none">
                        Click here
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}