import { configureStore } from '@reduxjs/toolkit';
import dreamSlice from './dreams/dreamSlice';

const store = configureStore({
  reducer: {
    dream: dreamSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
