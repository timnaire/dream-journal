import { createSlice } from '@reduxjs/toolkit';
import { Dream } from '../../../shared/models/dream';
import { Filter } from '../../../components/dream/FilterDream';
import moment from 'moment';

interface ListDream {
  [key: string]: Dream[];
}

interface InitialState {
  dreams: Dream[];
  displayDreams: ListDream;
  recentFavorite: Dream[];
  recentNightmare: Dream[];
  recentParalysis: Dream[];
  recentRecurrent: Dream[];
  search?: string;
  filteredDreams: Dream[];
  filters?: Filter;
  displayFilteredDreams: ListDream;
}

const initialState: InitialState = {
  dreams: [],
  displayDreams: {},
  recentFavorite: [],
  recentNightmare: [],
  recentParalysis: [],
  recentRecurrent: [],
  search: '',
  filteredDreams: [],
  filters: undefined,
  displayFilteredDreams: {},
};

const getToDisplayDreams = (dreams: Dream[]): ListDream => {
  const sortedDreams: ListDream = dreams
    .sort((a, b) => new Date(String(b.createdAt)).getTime() - new Date(String(a.createdAt)).getTime()) // Making sure that newly added dreams are sorted
    .reduce((acc: ListDream, dream) => {
      const month = moment(dream.createdAt).format('MMMM D');

      if (!acc[month]) {
        acc[month] = [];
      }

      acc[month].push(dream);
      return acc;
    }, {});

  return sortedDreams;
};

const updateDisplayDreams = (state: InitialState): void => {
  state.displayDreams = getToDisplayDreams(state.dreams);
};

export const dreamSlice = createSlice({
  name: 'dream',
  initialState,
  reducers: {
    initializeDream: (state, action: { type: string; payload: Dream[] }) => {
      state.dreams = action.payload;
      updateDisplayDreams(state);
    },
    addDream: (state, action: { type: string; payload: Dream[] }) => {
      state.dreams = [...state.dreams, ...action.payload];
      updateDisplayDreams(state);
    },
    updateDream: (state, action: { type: string; payload: Dream }) => {
      const id = action.payload.id;
      state.dreams = state.dreams.map((dream) => (dream.id === id ? action.payload : dream));
      updateDisplayDreams(state);
    },
    removeDream: (state, action: { type: string; payload: string }) => {
      state.dreams = state.dreams.filter((dream) => dream.id !== action.payload);
      updateDisplayDreams(state);
    },
    filterDream: (state, action: { type: string; payload: Filter }) => {
      const payload = action.payload;
      state.filters = action.payload;
      // state.filteredDreams = state.dreams.filter(
      //   (dream) =>
      //     dream.favorite === payload.favoriteOnly &&
      //     dream.recurrent === payload.dreamCharacteristic.recurrent &&
      //     dream.nightmare === payload.dreamCharacteristic.nightmare &&
      //     dream.paralysis === payload.dreamCharacteristic.paralysis
      // );
      state.displayFilteredDreams = getToDisplayDreams(state.filteredDreams);
    },
    searchDream: (state, action: { type: string; payload: string }) => {
      const keyword = action.payload.toLowerCase();
      if (state.search !== keyword) {
        state.filteredDreams = keyword
          ? state.dreams.filter(
              (dream) => dream.title.toLowerCase().includes(keyword) || dream.dream.toLowerCase().includes(keyword)
            )
          : [];
        state.displayFilteredDreams = getToDisplayDreams(state.filteredDreams);
        state.search = keyword;
      }
    },
    clearSearch: (state) => {
      state.filteredDreams = [];
      state.displayFilteredDreams = {};
    },
  },
});

export const { initializeDream, addDream, updateDream, removeDream, searchDream, clearSearch, filterDream } =
  dreamSlice.actions;
export default dreamSlice.reducer;
