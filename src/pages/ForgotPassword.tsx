import {
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
import { ReactComponent as BibliophileSvg } from './../assets/illustrations/undraw_bibliophile_re_xarc.svg';
import { ErrorMessage, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { AccountCircleOutlined } from '@mui/icons-material';
import * as yup from 'yup';

interface InitialState {
  username: string;
}

const forgotPasswordSchema = yup.object().shape({
  username: yup.string().trim().required('Username is required'),
});

const usernameIcon = {
  startAdornment: (
    <InputAdornment position="start">
      <AccountCircleOutlined />
    </InputAdornment>
  ),
};

export function ForgotPassword() {
  const theme = useTheme();

  const initialState: InitialState = {
    username: '',
  };

  const handleSubmit = (values: InitialState, setSubmitting: (isSubmitting: boolean) => void): void => {
    console.log('submitting...', values);
    setTimeout(() => setSubmitting(false), 5000);
  };

  return (
    <Container sx={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center', justifyContent: 'space-between' }}>
        <BibliophileSvg />

        <Box
          component={Paper}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: { xs: '100%', sm: '80%', md: '50%', lg: '30%' },
            padding: '25px',
          }}
        >
          <Typography variant="h3" component="h3">
            Dream Journal
          </Typography>
          <Box component="span" sx={{ paddingLeft: '3px', marginBottom: '32px', fontSize: '12px' }}>
            Click here to get back to&nbsp;
            <Link to="/sign-in" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
              Sign in
            </Link>
          </Box>

          <Formik
            initialValues={initialState}
            validationSchema={forgotPasswordSchema}
            onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
          >
            {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
              <Box
                component="form"
                noValidate
                autoComplete="off"
                sx={{ display: 'flex', flexDirection: 'column' }}
                onSubmit={handleSubmit}
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
                <ErrorMessage name="username">
                  {(msg) => <Box sx={{ color: 'red', mb: '25px' }}>{msg}</Box>}
                </ErrorMessage>

                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {isSubmitting ? <CircularProgress size={25} /> : 'Submit'}
                </Button>
              </Box>
            )}
          </Formik>
        </Box>
      </Box>
    </Container>
  );
}
