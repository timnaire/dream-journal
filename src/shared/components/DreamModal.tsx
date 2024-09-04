import { forwardRef, Ref, useRef, useState } from 'react';
import { CheckOutlined, CloseOutlined, MicNoneOutlined, PhotoOutlined } from '@mui/icons-material';
import { Formik, FormikProps } from 'formik';
import { ApiResponse, useApi } from '../hooks/useApi';
import { Dream } from '../models/dream';
import { dreamSchema } from '../schema/create-dream';
import { Transition } from './Transition';
import { useIsMobile } from '../hooks/useIsMobile';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import {
  Alert,
  AppBar,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  IconButton,
  Modal,
  styled,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import moment, { Moment } from 'moment';
import { S3Service } from '../services/s3.service';

const ModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  width: 300,
  [theme.breakpoints.up('sm')]: { width: 500 },
  [theme.breakpoints.up('md')]: { width: 700 },
  padding: 14,
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius * 1,
}));

export interface DreamModalProps extends DreamFormProps {
  isOpen: boolean;
  initialDate?: Moment;
}

export interface DreamFormProps {
  date?: Moment;
  editDream: Dream | null;
  onWriteDreamClose: () => void;
  onDreamSaved: (dream: Dream) => void;
}

export const DreamForm = forwardRef(function (
  { date, editDream, onWriteDreamClose, onDreamSaved }: DreamFormProps,
  ref: Ref<FormikProps<Dream>> | undefined
) {
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState('');
  const { isMobile } = useIsMobile();
  const { httpPost, httpPut } = useApi();
  const s3 = new S3Service();

  const initializeDream: Dream = {
    id: editDream ? editDream.id : '',
    title: editDream ? editDream.title : 'Title here',
    dream: editDream ? editDream.dream : 'My dream here',
    recurrent: editDream ? editDream.recurrent : false,
    nightmare: editDream ? editDream.nightmare : false,
    paralysis: editDream ? editDream.paralysis : false,
    favorite: editDream ? editDream.favorite : false,
  };

  const handleSubmit = async (values: Dream, setSubmitting: (isSubmitting: boolean) => void) => {
    let data = { ...values, createdAt: date };

    console.log('data', data);

    // if (file) {
    //   const image = await s3.upload(file.name, file, file.type);
    //   console.log('image', image);
    //   // data = {...data, imageFileName: image?.Key, imageUrl: image.Key};
    // }

    if (data.id) {
      httpPut<ApiResponse>('/dreams', data)
        .then((res) => {
          onDreamSaved(res.data);
          onWriteDreamClose();
        })
        .finally(() => {
          setSubmitting(false);
        });
    } else {
      httpPost<ApiResponse>('/dreams', data)
        .then((res) => {
          onDreamSaved(res.data);
          onWriteDreamClose();
        })
        .finally(() => {
          setSubmitting(false);
        });
    }
  };

  const handleFileChange = (event: any) => {
    setFileError(null);
    const file = event.target.files[0];

    const bytes = 1024;
    const megabytes = 5;
    const maxSize = bytes * bytes * megabytes;

    if (file.size > maxSize) {
      setFileError(`Error: Max file upload of ${megabytes}MB`);
      return;
    }

    if (file) {
      setFile(file);
      const objectUrl = URL.createObjectURL(file);
      setFilePreview(objectUrl);
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
          <div className="flex justify-end items-center text-xs mb-5">
            Mark as Favorite
            <Switch
              color="info"
              name="favorite"
              checked={values.favorite}
              value={values.favorite}
              onChange={handleChange}
            />
          </div>

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
          </FormGroup>

          {fileError && (
            <Alert variant="outlined" severity="error" className="mb-3">
              {fileError}
            </Alert>
          )}

          {/* Image Viewer */}
          {file && (
            <>
              <div className="flex justify-end px-24 mt-6">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setFile(null);
                    setFilePreview('');
                  }}
                >
                  Remove
                </Button>
              </div>
              <div className="h-56 w-full md:px-24 my-3 bg-contain bg-center">
                <img src={filePreview} alt="preview" className="h-full w-full" />
              </div>
            </>
          )}

          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleFileChange} accept="image/png, image/jpeg" />
          </Button>

          {/* Actions */}
          {!isMobile && (
            <Box sx={{ display: 'flex', justifyContent: 'end', mt: '12px' }}>
              <Button variant="outlined" onClick={onWriteDreamClose} sx={{ mr: '6px' }}>
                Close
              </Button>
              <Button variant="contained" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'submitting' : 'not submitting'}
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
export function DreamModal({ initialDate, isOpen, editDream, onWriteDreamClose, onDreamSaved }: DreamModalProps) {
  const [date, setDate] = useState(editDream ? moment(editDream.createdAt) : moment(initialDate));
  const { isMobile } = useIsMobile();
  const calendarRef = useRef<HTMLInputElement | null>(null);
  const formikRef = useRef<FormikProps<Dream>>(null);
  const dateDisplay = date.format('ll');

  const handleDreamClose = (): void => {
    onWriteDreamClose();
    setDate(moment());
  };

  const handleDreamMobile = (): void => {
    if (formikRef.current && !formikRef.current.isSubmitting) {
      formikRef.current.submitForm();
    }
  };

  const handleDateCalendar = (): void => {
    if (calendarRef.current) {
      calendarRef.current.click();
    }
  };

  return (
    <>
      {!isMobile && (
        <Modal open={isOpen} aria-labelledby="write-dream" aria-describedby="write-dream-entry">
          <ModalBox>
            {/* Title */}
            <Typography variant="h6" component="h2">
              Dream -{' '}
              <ButtonBase component="div" onClick={handleDateCalendar}>
                {dateDisplay}
              </ButtonBase>
            </Typography>

            {/* Body */}
            <Box sx={{ mt: 2 }}>
              <DreamForm
                date={date}
                editDream={editDream}
                onWriteDreamClose={handleDreamClose}
                onDreamSaved={onDreamSaved}
              />
            </Box>
          </ModalBox>
        </Modal>
      )}

      {isMobile && (
        <Dialog fullScreen open={isOpen} onClose={handleDreamClose} TransitionComponent={Transition}>
          <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
              <IconButton edge="start" color="inherit" onClick={handleDreamClose} aria-label="close">
                <CloseOutlined />
              </IconButton>

              <div className="flex justify-center w-full">
                <ButtonBase component="div" className="px-5 py-2" onClick={handleDateCalendar}>
                  <Typography>{dateDisplay}</Typography>
                </ButtonBase>
              </div>

              <IconButton edge="end" color="inherit" onClick={handleDreamMobile} aria-label="save">
                <CheckOutlined />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent>
            <DreamForm
              ref={formikRef}
              date={date}
              editDream={editDream}
              onWriteDreamClose={handleDreamClose}
              onDreamSaved={onDreamSaved}
            />
          </DialogContent>

          {/* <BottomNavigation value={''}>
            <BottomNavigationAction label="Recents" icon={<PhotoOutlined />} />
            <BottomNavigationAction label="Favorites" icon={<MicNoneOutlined />} />
          </BottomNavigation> */}
        </Dialog>
      )}

      {/* The date input that will trigger once the Date in the header is clicked */}
      <div className="hidden">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <MobileDatePicker inputRef={calendarRef} onAccept={(e) => setDate(e!)} value={date} disableFuture={true} />
        </LocalizationProvider>
      </div>
    </>
  );
}
