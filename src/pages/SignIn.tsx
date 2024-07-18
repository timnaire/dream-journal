import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { Box, Button, Container, InputAdornment, Link, Paper, TextField, Typography } from "@mui/material";
import { AccountCircleOutlined, KeyOutlined } from "@mui/icons-material";
import { AppContext } from "../core/context/AppContext";
import { ErrorMessage, Formik } from "formik";

interface Credentials {
    username: string;
    password: string;
}

export function SignIn() {
    const { isAuthenticated, setAppState } = useContext(AppContext);
    const initialValues: Credentials = {
        username: '',
        password: ''
    };

    const usernameIcon = {
        startAdornment: (
            <InputAdornment position="start">
                <AccountCircleOutlined />
            </InputAdornment>
        ),
    };

    const passwordIcon = {
        startAdornment: (
            <InputAdornment position="start">
                <KeyOutlined />
            </InputAdornment>
        ),
    };

    // If user is already authenticated redirect to the main page
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleSignin = (values: Credentials, setSubmitting: (isSubmitting: boolean) => void) => {
        // TODO: implement sign in
        if (values.username === 'admin' && values.password === 'test1234') {
            localStorage.setItem('isAuthenticated', 'true');
            setAppState({ isAuthenticated: true });
        }
        setSubmitting(false);
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

                <Formik
                    initialValues={initialValues}
                    validate={values => {
                        const errors = {} as Credentials;
                        if (!values.username) {
                            errors.username = 'Required';
                        }

                        if (!values.password) {
                            errors.password = 'Required';
                        }
                        return errors;
                    }}
                    onSubmit={(values, { setSubmitting }) => handleSignin(values, setSubmitting)}>
                    {({ values, errors, handleChange, handleSubmit, isSubmitting }) => (
                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                type="text"
                                name="username"
                                label="Username"
                                variant="standard"
                                sx={{ marginBottom: errors.username ? '0' : '25px' }}
                                InputProps={usernameIcon}
                                value={values.username}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="username">
                                {msg => <Box sx={{ color: 'red', marginBottom: '25px' }}>{msg}</Box>}
                            </ErrorMessage>

                            <TextField
                                type="password"
                                name="password"
                                label="Password"
                                variant="standard"
                                sx={{ marginBottom: errors.password ? '0' : '25px' }}
                                InputProps={passwordIcon}
                                value={values.password}
                                onChange={handleChange}
                            />
                            <ErrorMessage name="password">
                                {msg => <Box sx={{ color: 'red', marginBottom: '25px' }}>{msg}</Box>}
                            </ErrorMessage>
                            <Button type="submit" variant="contained" disabled={isSubmitting}>Sign in</Button>
                        </Box>
                    )}
                </Formik>

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