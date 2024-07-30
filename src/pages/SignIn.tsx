import { useContext, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Alert, Box, Button, CircularProgress, Container, IconButton, InputAdornment, Link, Paper, TextField, Typography } from '@mui/material';
import { AccountCircleOutlined, KeyOutlined, Visibility, VisibilityOff } from '@mui/icons-material';
import { AppContext } from '../core/context/AppContext';
import { ErrorMessage, Formik } from 'formik';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import * as yup from 'yup';
import { UserModel } from '../shared/models/user';

interface Credentials {
    username: string;
    password: string;
}

const signInSchema = yup.object().shape({
    username: yup.string().trim().required('Username is required'),
    password: yup.string().trim().required('Password is required'),
});

const usernameIcon = {
    startAdornment: (
        <InputAdornment position="start">
            <AccountCircleOutlined />
        </InputAdornment>
    ),
};

export function SignIn() {
    const { isAuthenticated, setAppState } = useContext(AppContext);
    const { isError, error, httpPost } = useApi();
    const [showPassword, setShowPassword] = useState(false);

    const initialValues: Credentials = {
        username: '',
        password: ''
    };

    const handleClickShowPassword = (): void => setShowPassword((show: boolean) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>): void => {
        event.preventDefault();
    };

    const passwordIcon = {
        startAdornment: (
            <InputAdornment position="start">
                <KeyOutlined />
            </InputAdornment>
        ),
        endAdornment: (
            <InputAdornment position="end">
                <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
            </InputAdornment>
        )
    };

    // If user is already authenticated redirect to the main page
    if (isAuthenticated) {
        return <Navigate to="/" replace />
    }

    const handleSignin = async (values: Credentials, setSubmitting: (isSubmitting: boolean) => void) => {
        httpPost<ApiResponse<UserModel>>('/auth/sign-in', values).then(res => {
            if (res && res.success) {
                setAppState({ loading: false, isAuthenticated: true, user: res.data });
            }
        }).finally(() => setSubmitting(false));
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
                    validationSchema={signInSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        handleSignin(values, setSubmitting);
                    }}>
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                type="text"
                                name="username"
                                label="Username"
                                variant="standard"
                                sx={{ mb: errors.username && touched.username ? '0' : '25px' }}
                                InputProps={usernameIcon}
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="username">
                                {msg => <Box sx={{ color: 'red', mb: '25px' }}>{msg}</Box>}
                            </ErrorMessage>

                            <TextField
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                label="Password"
                                variant="standard"
                                sx={{ mb: errors.password && touched.password ? '0' : '25px' }}
                                InputProps={passwordIcon}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="password">
                                {msg => <Box sx={{ color: 'red', mb: '25px' }}>{msg}</Box>}
                            </ErrorMessage>
                            <Button type="submit" variant="contained" disabled={isSubmitting}> {isSubmitting ? <CircularProgress size={25} /> : ' Sign in'} </Button>
                            {isError && (
                                <Alert variant="outlined" severity="error" sx={{ mt: '10px' }}>
                                    {error}
                                </Alert>
                            )}
                        </Box>
                    )}
                </Formik>

                <Box component="span" sx={{ textAlign: 'center', mt: '10px', fontSize: '12px' }}>
                    Forgot your password?&nbsp;
                    <Link href="/forgot-password" underline="none">
                        Click here
                    </Link>
                </Box>
            </Box>
        </Container>
    );
}