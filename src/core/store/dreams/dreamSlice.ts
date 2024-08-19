import { createSlice } from '@reduxjs/toolkit';
import { Dream } from '../../../shared/models/dream';

interface InitialState {
  dreams: Dream[];
  recentFavorite: Dream[];
  recentNightmare: Dream[];
  recentParalysis: Dream[];
  recentRecurrent: Dream[];
  search?: string;
  searchDreams: Dream[];
}

const initialState: InitialState = {
  dreams: [],
  recentFavorite: [],
  recentNightmare: [],
  recentParalysis: [],
  recentRecurrent: [],
  search: '',
  searchDreams: [],
};

export const dreamSlice = createSlice({
  name: 'dream',
  initialState,
  reducers: {
    initializeDream: (state, action: { type: string; payload: Dream[] }) => {
      state.dreams = [...action.payload];
    },
    addDream: (state, action: { type: string; payload: Dream[] }) => {
      state.dreams = [...state.dreams, ...action.payload];
    },
    updateDream: (state, action: { type: string; payload: Dream }) => {
      const id = action.payload.id;
      state.dreams = state.dreams.map((dream) => (dream.id === id ? action.payload : dream));
    },
    removeDream: (state, action: { type: string; payload: string }) => {
      state.dreams = state.dreams.filter((dream) => dream.id !== action.payload);
    },
    searchDream: (state, action: { type: string; payload: string }) => {
      const keyword = action.payload.toLowerCase();
      state.searchDreams =
        keyword !== ''
          ? state.dreams.filter(
              (dream) => dream.title.toLowerCase().includes(keyword) || dream.dream.toLowerCase().includes(keyword)
            )
          : [];
    },
    clearSearch: (state) => {
      state.searchDreams = [];
    },
  },
});

export const { initializeDream, addDream, updateDream, removeDream, searchDream, clearSearch } = dreamSlice.actions;
export default dreamSlice.reducer;
