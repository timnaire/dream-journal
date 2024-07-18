import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";

export function SignUp() {

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

                {/* <Formik
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
                </Formik> */}

                <Box component="form" noValidate autoComplete="off" sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            type="text"
                            name="firstname"
                            label="Firstname"
                            variant="standard"
                            sx={{ marginBottom: '25px' }}
                        />

                        <TextField
                            type="text"
                            name="lastname"
                            label="Lastname"
                            variant="standard"
                            sx={{ marginBottom: '25px' }}
                        />
                    </Box>

                    <TextField
                        type="text"
                        name="username"
                        label="Username"
                        variant="standard"
                        sx={{ marginBottom: '25px' }}
                    />

                    <TextField
                        type="password"
                        name="password"
                        label="Password"
                        variant="standard"
                        sx={{ marginBottom: '25px' }}
                    />

                    <TextField
                        type="password"
                        name="confirmpassword"
                        label="Confirm Password"
                        variant="standard"
                        sx={{ marginBottom: '25px' }}
                    />

                    <Button type="submit" variant="contained">Sign up</Button>
                </Box>

            </Box>
        </Container>
    );
}