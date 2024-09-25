import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorMessage, Formik } from 'formik';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { usePasswordWithIcon } from '../shared/hooks/usePasswordWithIcon';
import { AccountCircleOutlined } from '@mui/icons-material';
import { ReactComponent as BgAuth } from './../assets/illustrations/bg_auth.svg';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
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

const usernameIcon = {
  startAdornment: (
    <InputAdornment position="start">
      <AccountCircleOutlined />
    </InputAdornment>
  ),
};

export function SignUp() {
  const [data, setData] = useState();
  const { isError, error, httpPost } = useApi();
  const theme = useTheme();
  const password = usePasswordWithIcon();
  const confirmPassword = usePasswordWithIcon();

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
      .catch((error) => console.log('Error:', error))
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Paper elevation={0} className="rounded-none">
      <Container className="flex h-screen justify-center self-center">
        <div className="flex flex-col md:flex-row md:justify-around self-center grow">
          <BgAuth className="self-center md:absolute sm:z-10 size-56 md:size-auto" />

          <Box component={Paper} className="relative z-20 flex flex-col self-center p-5 md:p-5 w-80 sm:w-96">
            <Typography className="text-2xl md:text-3xl lg:text-4xl mb-3">Dream Journal</Typography>
            <div className="text-[12px] mb-5">
              Already have an account? Click here to&nbsp;
              <Link to="/sign-in" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                Sign in
              </Link>
            </div>

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
                  <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col grow">
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
                        {(msg) => <div className="text-red-500 mb-3">{msg}</div>}
                      </ErrorMessage>
                    </div>
                    <div className="flex flex-col grow">
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
                        {(msg) => <div className="text-red-500 mb-3">{msg}</div>}
                      </ErrorMessage>
                    </div>
                  </div>

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
                  <ErrorMessage name="username">{(msg) => <div className="text-red-500 mb-3">{msg}</div>}</ErrorMessage>

                  <TextField
                    type={password.show ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    variant="standard"
                    sx={{ mb: errors.password && touched.password ? '0' : '25px' }}
                    InputProps={password.icon}
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="password">{(msg) => <div className="text-red-500 mb-3">{msg}</div>}</ErrorMessage>

                  <TextField
                    type={confirmPassword.show ? 'text' : 'password'}
                    name="confirmPassword"
                    label="Confirm Password"
                    variant="standard"
                    sx={{ mb: errors.confirmPassword && touched.confirmPassword ? '0' : '25px' }}
                    InputProps={confirmPassword.icon}
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage name="confirmPassword">
                    {(msg) => <div className="text-red-500 mb-3">{msg}</div>}
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
        </div>
      </Container>
    </Paper>
  );
}
