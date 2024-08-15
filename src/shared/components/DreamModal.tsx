import { forwardRef, Ref, useRef } from 'react';
import { CheckOutlined, CloseOutlined } from '@mui/icons-material';
import { Formik, FormikProps } from 'formik';
import { ApiResponse, useApi } from '../hooks/useApi';
import { Dream } from '../models/dream';
import { dreamSchema } from '../schema/create-dream';
import { Transition } from './Transition';
import { useIsMobile } from '../hooks/useIsMobile';
import { Breakpoints } from '../../core/models/constants';
import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  IconButton,
  Modal,
  styled,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import moment from 'moment';

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  width: 300,
  [theme.breakpoints.up('sm')]: { width: 500 },
  [theme.breakpoints.up('md')]: { width: 700 },
  padding: 14,
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius * 1,
}));

export interface DreamModalProps extends DreamFormProps {
  isOpen: boolean;
}

export interface DreamFormProps {
  editDream: Dream | null;
  onWriteDreamClose: () => void;
  onDreamSaved: (dream: Dream) => void;
}

export const DreamForm = forwardRef(function (
  { editDream, onWriteDreamClose, onDreamSaved }: DreamFormProps,
  ref: Ref<FormikProps<Dream>> | undefined
) {
  const { isMobile } = useIsMobile(Breakpoints.MD);
  const { httpPost, httpPut } = useApi();
  // const { submitForm } = useFormikContext();

  const initializeDream: Dream = {
    id: editDream ? editDream.id : '',
    title: editDream ? editDream.title : 'Title here',
    dream: editDream ? editDream.dream : 'My dream here',
    recurrent: editDream ? editDream.recurrent : false,
    nightmare: editDream ? editDream.nightmare : false,
    paralysis: editDream ? editDream.paralysis : false,
    favorite: editDream ? editDream.favorite : false,
  };

  const handleSubmit = (values: Dream, setSubmitting: (isSubmitting: boolean) => void) => {
    if (values.id) {
      httpPut<ApiResponse>('/dreams', values)
        .then((res) => {
          onDreamSaved(res.data);
          onWriteDreamClose();
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      httpPost<ApiResponse>('/dreams', values)
        .then((res) => {
          onDreamSaved(res.data);
          onWriteDreamClose();
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  return (
    <Formik
      innerRef={ref}
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
            rows={isMobile ? 15 : 4}
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
          {!isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: '12px' }}>
              <Button variant="outlined" onClick={onWriteDreamClose} sx={{ mr: '6px' }}>
                Close
              </Button>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                <CheckOutlined sx={{ mr: '6px' }} /> Save Dream
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Formik>
  );
});

// Dialog = Mobile; Modal = Desktop
export function DreamModal({ isOpen, editDream, onWriteDreamClose, onDreamSaved }: DreamModalProps) {
  const { isMobile } = useIsMobile(Breakpoints.MD);
  const date = moment().format('ll');
  const formikRef = useRef<FormikProps<Dream>>(null);

  const handleDreamMobile = (): void => {
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  return (
    <>
      {!isMobile && (
        <Modal open={isOpen} aria-labelledby="write-dream" aria-describedby="write-dream-entry">
          <ModalBox>
            {/* Title */}
            <Typography variant="h6" component="h2">
              Dream - {date}
            </Typography>

            {/* Body */}
            <Box sx={{ mt: 2 }}>
              <DreamForm editDream={editDream} onWriteDreamClose={onWriteDreamClose} onDreamSaved={onDreamSaved} />
            </Box>
          </ModalBox>
        </Modal>
      )}

      {isMobile && (
        <Dialog fullScreen open={isOpen} onClose={onWriteDreamClose} TransitionComponent={Transition}>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={onWriteDreamClose} aria-label="close">
                <CloseOutlined />
              </IconButton>
              <Typography component="div" className="flex justify-center w-full">
                {date}
              </Typography>
              <IconButton edge="end" color="inherit" onClick={handleDreamMobile} aria-label="save">
                <CheckOutlined />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <DreamForm
              ref={formikRef}
              editDream={editDream}
              onWriteDreamClose={onWriteDreamClose}
              onDreamSaved={onDreamSaved}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
