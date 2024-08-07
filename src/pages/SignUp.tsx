import { Alert, Box, Button, CircularProgress, Container, Paper, TextField, Typography, useTheme } from '@mui/material';
import { ErrorMessage, Formik } from 'formik';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { useState } from 'react';
import { ReactComponent as BibliophileSvg } from './../assets/illustrations/bibliophile.svg';
import { Link } from 'react-router-dom';
import { useIsMobile } from '../shared/hooks/useIsMobile';
import * as yup from 'yup';

interface User {
  firstname: string;
  lastname: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const signUpSchema = yup.object().shape({
  firstname: yup.string().trim().required('Firstname is required'),
  lastname: yup.string().trim().required('Lastname is required'),
  username: yup.string().trim().required('Username is required'),
  password: yup.string().required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});

export function SignUp() {
  const [data, setData] = useState();
  const { isError, error, httpPost } = useApi();
  const theme = useTheme();
  const { isMobile } = useIsMobile();
  const width = isMobile ? 250 : 500;
  const height = isMobile ? 300 : 450;

  const initialValues: User = {
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    confirmPassword: '',
  };

  const handleSignup = (values: User, setSubmitting: (isSubmitting: boolean) => void): void => {
    httpPost<ApiResponse>('/auth/sign-up', values)
      .then((response) => {
        setData(response.data);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        <BibliophileSvg width={width} height={height} />
        <Box
          component={Paper}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', sm: '80%', md: '50%', lg: '30%' },
            padding: '25px',
            margin: '25px',
          }}
        >
          <Typography variant="h3" component="h3">
            Dream Journal
          </Typography>
          <Box component="span" sx={{ paddingLeft: '3px', marginBottom: '32px', fontSize: '12px' }}>
            Already have an account? Click here to&nbsp;
            <Link to="/sign-in" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
              Sign in
            </Link>
          </Box>

          <Formik
            initialValues={initialValues}
            validationSchema={signUpSchema}
            onSubmit={(values, { setSubmitting }) => handleSignup(values, setSubmitting)}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={handleSubmit}
              >
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                      type="text"
                      name="firstname"
                      label="Firstname"
                      variant="standard"
                      sx={{ mb: errors.firstname && touched.firstname ? '0' : '25px' }}
                      value={values.firstname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="firstname">
                      {(msg) => <Box sx={{ color: 'red', mb: '25px' }}>{msg}</Box>}
                    </ErrorMessage>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                      type="text"
                      name="lastname"
                      label="Lastname"
                      variant="standard"
                      sx={{ mb: errors.lastname && touched.lastname ? '0' : '25px' }}
                      value={values.lastname}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <ErrorMessage name="lastname">
                      {(msg) => <Box sx={{ color: 'red', mb: '25px' }}>{msg}</Box>}
                    </ErrorMessage>
                  </Box>
                </Box>

                <TextField
                  type="text"
                  name="username"
                  label="Username"
                  variant="standard"
                  sx={{ mb: errors.username && touched.username ? '0' : '25px' }}
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="username">
                  {(msg) => <Box sx={{ color: 'red', mb: '25px' }}>{msg}</Box>}
                </ErrorMessage>

                <TextField
                  type="password"
                  name="password"
                  label="Password"
                  variant="standard"
                  sx={{ mb: errors.password && touched.password ? '0' : '25px' }}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="password">
                  {(msg) => <Box sx={{ color: 'red', mb: '25px' }}>{msg}</Box>}
                </ErrorMessage>

                <TextField
                  type="password"
                  name="confirmPassword"
                  label="Confirm Password"
                  variant="standard"
                  sx={{ mb: errors.confirmPassword && touched.confirmPassword ? '0' : '25px' }}
                  value={values.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage name="confirmPassword">
                  {(msg) => <Box sx={{ color: 'red', mb: '25px' }}>{msg}</Box>}
                </ErrorMessage>

                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={25} /> : 'Sign up'}
                </Button>
                {data && (
                  <Alert variant="outlined" severity={isError ? 'error' : 'success'} sx={{ mt: '10px' }}>
                    {isError ? error : 'Successfully registered.'}
                  </Alert>
                )}
              </Box>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
}
