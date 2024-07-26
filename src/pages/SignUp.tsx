import { Box, Button, CircularProgress, Container, Link, Paper, TextField, Typography } from '@mui/material';
import { ErrorMessage, Formik } from 'formik';
import * as yup from 'yup';
import { useApi } from '../shared/hooks/useApi';

interface User {
    firstname: string;
    lastname: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export function SignUp() {
    const { httpPost } = useApi();
    const initialValues: User = {
        firstname: '',
        lastname: '',
        username: '',
        password: '',
        confirmPassword: '',
    }

    const signUpSchema = yup.object().shape({
        firstname: yup.string().trim().required('Firstname is required'),
        lastname: yup.string().trim().required('Lastname is required'),
        username: yup.string().trim().required('Username is required'),
        password: yup.string().required('Password is required'),
        confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm Password is required'),
    });

    const handleSignup = (values: User, setSubmitting: (isSubmitting: boolean) => void) => {
        httpPost('/sign-up', values).then(data => {
            console.log('data', data);
            setTimeout(() => setSubmitting(false), 5000);
        });
    }

    return (
        <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
            <Box component={Paper} sx={{ display: 'flex', flexDirection: 'column', width: { xs: '100%', sm: '80%', md: '50%', lg: '30%' }, padding: '25px' }}>
                <Typography variant="h3" component="h3" >
                    Dream Journal
                </Typography>
                <Box component="span" sx={{ paddingLeft: '3px', marginBottom: '32px', fontSize: '12px' }}>
                    Already have an account? Click here to&nbsp;
                    <Link href="/sign-in" underline="none">
                        Sign in
                    </Link>
                </Box>

                <Formik
                    initialValues={initialValues}
                    validationSchema={signUpSchema}
                    onSubmit={(values, { setSubmitting }) => handleSignup(values, setSubmitting)}>
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column' }} onSubmit={handleSubmit}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <TextField
                                        type="text"
                                        name="firstname"
                                        label="Firstname"
                                        variant="standard"
                                        sx={{ marginBottom: errors.firstname && touched.firstname ? '0' : '25px' }}
                                        value={values.firstname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="firstname">
                                        {msg => <Box sx={{ color: 'red', marginBottom: '25px' }}>{msg}</Box>}
                                    </ErrorMessage>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <TextField
                                        type="text"
                                        name="lastname"
                                        label="Lastname"
                                        variant="standard"
                                        sx={{ marginBottom: errors.lastname && touched.lastname ? '0' : '25px' }}
                                        value={values.lastname}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    <ErrorMessage name="lastname">
                                        {msg => <Box sx={{ color: 'red', marginBottom: '25px' }}>{msg}</Box>}
                                    </ErrorMessage>
                                </Box>
                            </Box>

                            <TextField
                                type="text"
                                name="username"
                                label="Username"
                                variant="standard"
                                sx={{ marginBottom: errors.username && touched.username ? '0' : '25px' }}
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
                                value={values.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="password">
                                {msg => <Box sx={{ color: 'red', marginBottom: '25px' }}>{msg}</Box>}
                            </ErrorMessage>

                            <TextField
                                type="password"
                                name="confirmPassword"
                                label="Confirm Password"
                                variant="standard"
                                sx={{ marginBottom: errors.confirmPassword && touched.confirmPassword ? '0' : '25px' }}
                                value={values.confirmPassword}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            <ErrorMessage name="confirmPassword">
                                {msg => <Box sx={{ color: 'red', marginBottom: '25px' }}>{msg}</Box>}
                            </ErrorMessage>

                            <Button type="submit" variant="contained" disabled={isSubmitting}>{isSubmitting ? <CircularProgress size={25} /> : ' Sign up'} </Button>
                        </Box>
                    )}
                </Formik>

            </Box>
        </Container>
    );
}