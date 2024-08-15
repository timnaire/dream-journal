import * as yup from 'yup';

export const dreamSchema = yup.object().shape({
  id: yup.string().trim(),
  title: yup.string().trim().required('Title is required'),
  dream: yup.string().trim().required('Dream is required'),
  recurrent: yup.boolean(),
  nightmare: yup.boolean(),
  paralysis: yup.boolean(),
  favorite: yup.boolean(),
});
