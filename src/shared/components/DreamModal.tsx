import { CheckOutlined } from '@mui/icons-material';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Modal, styled, TextField, Typography } from '@mui/material';
import { Formik } from 'formik';
import { useApi } from '../hooks/useApi';
import moment from 'moment';
import * as yup from 'yup';

interface DreamModalProps {
    isOpen: boolean;
    handleWriteDreamClose: () => void;
}

interface Dreams {
    title: string;
    dream: string;
    recurrent: boolean;
    nightmare: boolean;
    paralysis: boolean;
    favorite: boolean;
}

const ModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: theme.palette.background.paper,
    width: 250,
    [theme.breakpoints.up('sm')]: { width: 400 },
    [theme.breakpoints.up('md')]: { width: 600 },
    padding: 14,
    boxShadow: theme.shadows[24],
    borderRadius: theme.shape.borderRadius * 1
}));

const dreamSchema = yup.object().shape({
    title: yup.string().trim().required('Title is required'),
    dream: yup.string().trim().required('Dream is required'),
    recurrent: yup.boolean(),
    nightmare: yup.boolean(),
    paralysis: yup.boolean(),
    favorite: yup.boolean(),
});

export function DreamModal({ isOpen, handleWriteDreamClose }: DreamModalProps) {
    const { httpPost } = useApi();
    const date = moment().format('ll');

    const initializeDream: Dreams = {
        title: 'Title here',
        dream: 'My dream here',
        recurrent: false,
        nightmare: false,
        paralysis: false,
        favorite: false,
    }

    // TODO: Post an api call to save dreams
    const handleSubmit = (values: Dreams, setSubmitting: ((isSubmitting: boolean) => void)) => {
        console.log('values', values);
        setTimeout(() => {
            setSubmitting(false);
        }, 5000);
    };

    return (
        <Modal open={isOpen} aria-labelledby="write-dream" aria-describedby="write-dream-entry">
            <ModalBox>
                {/* Title */}
                <Typography variant="h6" component="h2">
                    Dream - {date}
                </Typography>

                {/* Body */}
                <Box sx={{ mt: 2 }}>
                    <Formik
                        initialValues={initializeDream}
                        validationSchema={dreamSchema}
                        onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}>
                        {({ values, handleChange, handleSubmit, isSubmitting }) => (
                            <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                                {/* Fields */}
                                <TextField name="title" label="Title of your dream" fullWidth={true} sx={{ mb: '12px' }} value={values.title} onChange={handleChange} />
                                <TextField name="dream" label="Enter your dream" fullWidth={true} multiline rows={4} value={values.dream} onChange={handleChange} />

                                <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                                    <FormControlLabel name="recurrent" value={values.dream} onChange={handleChange} control={<Checkbox />} label="Recurrent" />
                                    <FormControlLabel name="nightmare" value={values.dream} onChange={handleChange} control={<Checkbox />} label="Nightmare" />
                                    <FormControlLabel name="paralysis" value={values.dream} onChange={handleChange} control={<Checkbox />} label="Sleep paralysis" />
                                    <FormControlLabel name="favorite" value={values.dream} onChange={handleChange} control={<Checkbox />} label="Favorite" />
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
            </ModalBox>
        </Modal>
    );
}