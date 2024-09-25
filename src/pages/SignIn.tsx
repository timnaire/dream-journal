import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { AccountCircleOutlined } from '@mui/icons-material';
import { AppContext } from '../core/context/AppContext';
import { ErrorMessage, Formik } from 'formik';
import { ApiResponse, useApi } from '../shared/hooks/useApi';
import { UserModel } from '../shared/models/user';
import { usePasswordWithIcon } from '../shared/hooks/usePasswordWithIcon';
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
  const password = usePasswordWithIcon();
  const theme = useTheme();

  const initialValues: Credentials = {
    username: '',
    password: '',
  };

  // If user is already authenticated redirect to the main page
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSignin = (values: Credentials, setSubmitting: (isSubmitting: boolean) => void): void => {
    httpPost<ApiResponse<UserModel>>('/auth/sign-in', values)
      .then((res) => {
        if (res && res.success) {
          setAppState({ loading: false, isAuthenticated: true, user: res.data });
        }
      })
      .catch((error) => console.log('Error:', error))
      .finally(() => setSubmitting(false));
  };

  return (
    <Paper elevation={0} className="rounded-none">
      <Container className="flex h-screen justify-center self-center">
        <div className="flex flex-col md:flex-row md:justify-around self-center grow">
          <BgAuth className="self-center md:absolute sm:z-10 size-56 md:size-auto" />

          <Box component={Paper} className="relative z-20 flex flex-col self-center p-5 md:p-5 w-80 sm:w-96">
            <div>
              <Typography className="text-2xl md:text-3xl lg:text-4xl mb-3">Dream Journal</Typography>
              <div className="text-[12px] mb-5">
                Don't have an account? Click here to&nbsp;
                <Link to="/sign-up" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                  Sign Up
                </Link>
              </div>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={signInSchema}
              onSubmit={(values, { setSubmitting }) => {
                handleSignin(values, setSubmitting);
              }}
            >
              {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                <Box
                  component="form"
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                  sx={{ display: 'flex', flexDirection: 'column' }}
                >
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
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {isSubmitting ? <CircularProgress size={25} /> : 'Sign in'}
                  </Button>
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
              <Link to="/forgot-password" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                Click here
              </Link>
            </Box>
          </Box>
        </div>
      </Container>
    </Paper>
  );
}
