import { forwardRef, Ref, useRef, useState } from 'react';
import { CheckOutlined, CloseOutlined, MicNoneOutlined, PhotoOutlined } from '@mui/icons-material';
import { Formik, FormikProps } from 'formik';
import { ApiResponse, useApi } from '../../shared/hooks/useApi';
import { Dream, DreamRequest } from '../../shared/models/dream';
import { dreamSchema } from '../../shared/schema/create-dream';
import { Transition } from '../../shared/components/Transition';
import { useIsMobile } from '../../shared/hooks/useIsMobile';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers';
import { ModalBox } from '../../shared/styles/modal';
import { S3Service } from '../../shared/services/s3.service';
import {
  Alert,
  AppBar,
  Box,
  Button,
  ButtonBase,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControlLabel,
  FormGroup,
  IconButton,
  Link,
  Modal,
  Snackbar,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import moment, { Moment } from 'moment';

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
  const { httpPost, httpPut, isError, error } = useApi();
  const s3 = new S3Service();

  // Temp
  const [audio, setAudio] = useState(false);

  const initializeDream: Dream = {
    id: editDream ? editDream.id : '',
    title: editDream ? editDream.title : 'Title here',
    dream: editDream ? editDream.dream : 'My dream here',
    recurrent: editDream ? editDream.recurrent : false,
    nightmare: editDream ? editDream.nightmare : false,
    paralysis: editDream ? editDream.paralysis : false,
    favorite: editDream ? editDream.favorite : false,
  };

  const handleSubmit = async (values: Dream): Promise<void> => {
    let payload = { ...values, createdAt: date } as DreamRequest;

    if (file) {
      const img = await s3.upload(file.name, file, file.type);
      const image = { ...img, size: file.size, fileType: file.type };
      payload = { ...payload, image };
    }

    return new Promise((resolve) => {
      if (payload.id) {
        httpPut<ApiResponse>('/dreams', payload)
          .then((res) => {
            if (res && res.success) {
              onDreamSaved(res.data);
              onWriteDreamClose();
            }
            resolve();
          })
          .catch((error) => console.log('Error:', error));
      } else {
        httpPost<ApiResponse>('/dreams', payload)
          .then((res) => {
            if (res && res.success) {
              onDreamSaved(res.data);
              onWriteDreamClose();
            }
            resolve();
          })
          .catch((error) => console.log('Error:', error));
      }
    });
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

  const audioContent = (
    <Snackbar
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      open={audio}
      autoHideDuration={3000}
      onClose={() => setAudio(false)}
      message="In Development..."
    />
  );

  return (
    <Formik
      innerRef={ref}
      initialValues={initializeDream}
      validationSchema={dreamSchema}
      onSubmit={(values) => handleSubmit(values)}
    >
      {({ values, handleChange, handleSubmit, isSubmitting }) => (
        <div className={`flex flex-col relative ${!file && 'h-full'}`}>
          {isSubmitting && isMobile && (
            <div className="absolute inset-0 bg-white/30 backdrop-opacity-10 z-20">
              <div className="flex flex-col justify-center items-center h-full">
                <CircularProgress />
                Saving...
              </div>
            </div>
          )}
          <Box
            component="form"
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
            className={`${isMobile ? 'p-4' : ''}`}
          >
            {isError && (
              <Alert variant="outlined" severity="error" className="mb-3">
                {error}
              </Alert>
            )}

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
                <div className="h-56 w-full md:px-24 mt-3 bg-contain bg-center">
                  <img src={filePreview} alt="preview" className="h-full w-full" />
                </div>
                <div className="w-full md:px-24">
                  <Link
                    component="button"
                    variant="body2"
                    color="error"
                    onClick={() => {
                      setFile(null);
                      setFilePreview('');
                    }}
                  >
                    Remove
                  </Link>
                </div>
              </>
            )}

            {/* Actions */}
            {!isMobile && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: '12px' }}>
                <div className="flex">
                  <IconButton component="label">
                    <PhotoOutlined />
                    <input type="file" hidden onChange={handleFileChange} accept="image/png, image/jpeg" />
                  </IconButton>
                  <IconButton component="label" onClick={() => setAudio(true)}>
                    <MicNoneOutlined />
                    {/* <input type="file" hidden onChange={handleFileChange} accept="audio/*" /> */}
                    {audioContent}
                  </IconButton>
                </div>
                <div>
                  <Button variant="outlined" onClick={onWriteDreamClose} sx={{ mr: '6px' }}>
                    Close
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    <CheckOutlined sx={{ mr: '6px' }} /> Save Dream
                  </Button>
                </div>
              </Box>
            )}
          </Box>

          {isMobile && (
            <div className="flex justify-center grow items-end">
              <div className="grow text-center">
                <ButtonBase component="label" className="w-full p-3">
                  <PhotoOutlined />
                  <input type="file" hidden onChange={handleFileChange} accept="image/png, image/jpeg" />
                </ButtonBase>
              </div>
              <div className="grow text-center">
                <ButtonBase component="label" className="w-full p-3" onClick={() => setAudio(true)}>
                  <MicNoneOutlined />
                  {/* <input type="file" hidden onChange={handleFileChange} accept="audio/*" /> */}
                  {audioContent}
                </ButtonBase>
              </div>
            </div>
          )}
        </div>
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDreamClose = (): void => {
    onWriteDreamClose();
    setDate(moment());
  };

  const handleDreamMobile = (): void => {
    setIsSubmitting((s) => true);
    if (formikRef.current) {
      formikRef.current.submitForm().finally(() => setIsSubmitting((s) => false));
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

              <IconButton
                edge="end"
                color="inherit"
                disabled={isSubmitting}
                onClick={handleDreamMobile}
                aria-label="save"
              >
                <CheckOutlined />
              </IconButton>
            </Toolbar>
          </AppBar>
          <DialogContent className="p-0">
            <DreamForm
              ref={formikRef}
              date={date}
              editDream={editDream}
              onWriteDreamClose={handleDreamClose}
              onDreamSaved={onDreamSaved}
            />
          </DialogContent>
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
