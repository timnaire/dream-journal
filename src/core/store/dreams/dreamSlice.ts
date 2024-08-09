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
    addDream: (state, action) => {
      state.dreams = [...action.payload];
    },
  },
});

export const { addDream } = dreamSlice.actions;
export default dreamSlice.reducer;
