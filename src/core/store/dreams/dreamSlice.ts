import { createSlice } from '@reduxjs/toolkit';
import { DreamModel } from '../../../shared/models/dream';

interface InitialState {
  dreams: DreamModel[];
  recentFavorite: DreamModel[];
  recentNightmare: DreamModel[];
  recentParalysis: DreamModel[];
  recentRecurrent: DreamModel[];
}

const initialState: InitialState = {
  dreams: [],
  recentFavorite: [],
  recentNightmare: [],
  recentParalysis: [],
  recentRecurrent: [],
};

export const dreamSlice = createSlice({
  name: 'dream',
  initialState,
  reducers: {
    initializeDream: (state, action: { type: string; payload: DreamModel[] }) => {
      state.dreams = action.payload;
    },
    addDream: (state, action: { type: string; payload: DreamModel[] }) => {
      state.dreams = [...state.dreams, ...action.payload];
    },
    updateDream: (state, action: { type: string; payload: DreamModel }) => {
      const id = action.payload.id;
      state.dreams = state.dreams.map((dream) => (dream.id === id ? action.payload : dream));
    },
    removeDream: (state, action: { type: string; payload: string }) => {
      state.dreams = state.dreams.filter((dream) => dream.id !== action.payload);
    },
  },
});

export const { initializeDream, addDream, updateDream, removeDream } = dreamSlice.actions;
export default dreamSlice.reducer;
