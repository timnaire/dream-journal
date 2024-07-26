import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { Box, Button, CircularProgress, Container, InputAdornment, Link, Paper, TextField, Typography } from '@mui/material';
import { AccountCircleOutlined, KeyOutlined } from '@mui/icons-material';
import { AppContext, UserProps } from '../core/context/AppContext';
import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';
import { ApiResponse, useApi } from '../shared/hooks/useApi';

interface Credentials {
    username: string;
    password: string;
}

export function SignIn() {
    const { isAuthenticated, setAppState } = useContext(AppContext);
    const { httpPost } = useApi();
    const initialValues: Credentials = {
        username: '',
        password: ''
    };

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

    const handleSignin = async (values: Credentials, setSubmitting: (isSubmitting: boolean) => void) => {
        httpPost<ApiResponse<UserProps>>('/auth/sign-in', values).then(res => {
            console.log('res', res);
            if (res && res.success) {
                setAppState({ isAuthenticated: true, user: res.data });
            }
            // setTimeout(() => setSubmitting(false), 5000);
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
                        console.log('form submitted');
                        handleSignin(values, setSubmitting);
                    }}>
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting, isValid }) => (
                        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column' }}>
                            <TextField
                                type="text"
                                name="username"
                                label="Username"
                                variant="standard"
                                sx={{ marginBottom: errors.username && touched.username ? '0' : '25px' }}
                                InputProps={usernameIcon}
                                value={values.username}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="username">
                                {msg => <Box sx={{ color: 'red', marginBottom: '25px' }}>{msg}</Box>}
                            </ErrorMessage>

                            <TextField
                                type="password"
                                name="password"
                                label="Password"
                                variant="standard"
                                sx={{ marginBottom: errors.password && touched.password ? '0' : '25px' }}
                                InputProps={passwordIcon}
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="password">
                                {msg => <Box sx={{ color: 'red', marginBottom: '25px' }}>{msg}</Box>}
                            </ErrorMessage>
                            <Button type="submit" variant="contained" disabled={isSubmitting}> {isSubmitting ? <CircularProgress size={25} /> : ' Sign in'} </Button>
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