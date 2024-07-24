import { useState } from 'react';
import { CheckOutlined, EditOutlined } from '@mui/icons-material';
import { Box, Button, Checkbox, Container, FormControlLabel, FormGroup, Modal, TextField, Typography } from '@mui/material';
import { useDreams } from '../shared/hooks/useDreams';
import { Dream } from '../shared/components/Dream';
import { Formik } from 'formik';
import moment from 'moment';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};

export function Home() {
    const { dreams, isLoading } = useDreams();

    const [writeDream, setWriteDream] = useState(false);
    const date = moment().format('ll');

    const handleWriteDreamOpen = () => setWriteDream(true);
    const handleWriteDreamClose = () => setWriteDream(false);

    if (isLoading) {
        return (<div>Loading...</div>);
    }

    return (
        <Container>
            <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, alignItems: 'center', overflow: 'hidden', p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'end', py: '10px', width: { xs: '100%', sm: '80%', md: '60%' }, mb: '25px' }}>
                    <Button variant="contained" onClick={handleWriteDreamOpen}><EditOutlined sx={{ mr: '6px' }} /> Write a dream</Button>
                </Box>

                {/* Dream entries */}
                {dreams && dreams.map((dream) => <Dream key={dream.id} dream={dream} />)}
            </Box>

            <Modal open={writeDream} aria-labelledby="write-dream" aria-describedby="write-dream-entry" >
                <Box sx={style}>
                    {/* Title */}
                    <Typography variant="h6" component="h2">
                        Dream - {date}
                    </Typography>

                    {/* Body */}
                    <Box sx={{ mt: 2 }}>
                        <Formik initialValues={{ title: '', dream: '' }} onSubmit={(values, { setSubmitting }) => {
                            setTimeout(() => {
                                alert(JSON.stringify(values, null, 2));
                                setSubmitting(false);
                            }, 2000);
                        }}>
                            {({ values, handleChange, handleSubmit, isSubmitting }) => (
                                <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                                    {/* Fields */}
                                    <TextField name="title" label="Title of your dream" fullWidth={true} sx={{ mb: '12px' }} value={values.title} onChange={handleChange} />
                                    <TextField name="dream" label="Enter your dream" fullWidth={true} multiline rows={4} value={values.dream} onChange={handleChange} />

                                    <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                        <FormControlLabel control={<Checkbox />} label="Recurrent" />
                                        <FormControlLabel control={<Checkbox />} label="Nightmare" />
                                        <FormControlLabel control={<Checkbox />} label="Sleep paralysis" />
                                        <FormControlLabel control={<Checkbox />} label="Favorite" />
                                    </FormGroup>

                                    {/* Actions */}
                                    <Box sx={{ display: 'flex', justifyContent: 'end', mt: '12px' }}>
                                        <Button variant="outlined" onClick={handleWriteDreamClose} sx={{ mr: '6px' }}>Close</Button>
                                        <Button variant="contained" type="submit" disabled={isSubmitting}><CheckOutlined sx={{ mr: '6px' }} /> Save Dream</Button>
                                    </Box>
                                </Box>
                            )}
                        </Formik>
                    </Box>
                </Box>
            </Modal>
        </Container >
    );
}