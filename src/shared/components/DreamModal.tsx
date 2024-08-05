import { CheckOutlined } from '@mui/icons-material';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Modal,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { Formik } from 'formik';
import { useApi } from '../hooks/useApi';
import { DreamModel } from '../models/dream';
import moment from 'moment';
import * as yup from 'yup';

interface DreamModalProps {
  isOpen: boolean;
  editDream: DreamModel | null;
  writeDreamClose: () => void;
  dreamSaved: () => void;
}

interface Dreams {
  id?: string;
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
  borderRadius: theme.shape.borderRadius * 1,
}));

const dreamSchema = yup.object().shape({
  id: yup.string().trim(),
  title: yup.string().trim().required('Title is required'),
  dream: yup.string().trim().required('Dream is required'),
  recurrent: yup.boolean(),
  nightmare: yup.boolean(),
  paralysis: yup.boolean(),
  favorite: yup.boolean(),
});

export function DreamModal({ isOpen, editDream, writeDreamClose, dreamSaved }: DreamModalProps) {
  const { httpPost, httpPut } = useApi();
  const date = moment().format('ll');
  console.log('editDream', editDream);
  const initializeDream: Dreams = {
    id: editDream ? editDream.id : '',
    title: editDream ? editDream.title : 'Title here',
    dream: editDream ? editDream.dream : 'My dream here',
    recurrent: editDream ? editDream.recurrent : false,
    nightmare: editDream ? editDream.nightmare : false,
    paralysis: editDream ? editDream.paralysis : false,
    favorite: editDream ? editDream.favorite : false,
  };

  const handleSubmit = (values: Dreams, setSubmitting: (isSubmitting: boolean) => void) => {
    if (values.id) {
      httpPut('/dreams', values)
        .then((res) => {
          dreamSaved();
          writeDreamClose();
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      httpPost('/dreams', values)
        .then((res) => {
          dreamSaved();
          writeDreamClose();
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
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
            onSubmit={(values, { setSubmitting }) => handleSubmit(values, setSubmitting)}
          >
            {({ values, handleChange, handleSubmit, isSubmitting }) => (
              <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
                {/* Fields */}
                <TextField
                  name="title"
                  label="Title of your dream"
                  fullWidth={true}
                  sx={{ mb: '12px' }}
                  value={values.title}
                  onChange={handleChange}
                />
                <TextField
                  name="dream"
                  label="Enter your dream"
                  fullWidth={true}
                  multiline
                  rows={4}
                  value={values.dream}
                  onChange={handleChange}
                />

                <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
                  <FormControlLabel
                    name="recurrent"
                    checked={values.recurrent}
                    value={values.recurrent}
                    onChange={handleChange}
                    control={<Checkbox />}
                    label="Recurrent"
                  />
                  <FormControlLabel
                    name="nightmare"
                    checked={values.nightmare}
                    value={values.nightmare}
                    onChange={handleChange}
                    control={<Checkbox />}
                    label="Nightmare"
                  />
                  <FormControlLabel
                    name="paralysis"
                    checked={values.paralysis}
                    value={values.paralysis}
                    onChange={handleChange}
                    control={<Checkbox />}
                    label="Sleep paralysis"
                  />
                  <FormControlLabel
                    name="favorite"
                    checked={values.favorite}
                    value={values.favorite}
                    onChange={handleChange}
                    control={<Checkbox />}
                    label="Favorite"
                  />
                </FormGroup>

                {/* Actions */}
                <Box sx={{ display: 'flex', justifyContent: 'end', mt: '12px' }}>
                  <Button variant="outlined" onClick={writeDreamClose} sx={{ mr: '6px' }}>
                    Close
                  </Button>
                  <Button variant="contained" type="submit" disabled={isSubmitting}>
                    <CheckOutlined sx={{ mr: '6px' }} /> Save Dream
                  </Button>
                </Box>
              </Box>
            )}
          </Formik>
        </Box>
      </ModalBox>
    </Modal>
  );
}
