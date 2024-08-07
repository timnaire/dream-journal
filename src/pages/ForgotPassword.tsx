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
import { ReactComponent as BibliophileSvg } from './../assets/illustrations/bibliophile.svg';
import { ErrorMessage, Formik } from 'formik';
import { Link } from 'react-router-dom';
import { AccountCircleOutlined } from '@mui/icons-material';
import { useIsMobile } from '../shared/hooks/useIsMobile';
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
  const { isMobile } = useIsMobile();
  const width = isMobile ? 250 : 500;
  const height = isMobile ? 300 : 450;

  const initialState: InitialState = {
    username: '',
  };

  const handleSubmit = (values: InitialState, setSubmitting: (isSubmitting: boolean) => void): void => {
    console.log('submitting...', values);
    setTimeout(() => setSubmitting(false), 5000);
  };

  return (
    <Container className="flex h-screen justify-center self-center">
      <div className="flex flex-col md:flex-row md:justify-around self-center grow">
        <BibliophileSvg className="self-center" width={width} height={height} />
        <Box component={Paper} className="flex flex-col self-center p-5 md:p-5 w-96">

          <div>
            <Typography className="text-3xl md:text-4xl lg:text-5xl">
              Dream Journal
            </Typography>
            <div className="text-[12px]">
              Click here to get back to&nbsp;
              <Link to="/sign-in" style={{ textDecoration: 'none', color: theme.palette.primary.main }}>
                Sign in
              </Link>
            </div>
          </div>

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
                className="grow justify-center"
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
      </div>
    </Container>
  );
}
