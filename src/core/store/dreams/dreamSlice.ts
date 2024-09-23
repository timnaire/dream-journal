import { createSlice } from '@reduxjs/toolkit';
import { Dream } from '../../../shared/models/dream';
import { Filter, FilterType } from '../../../shared/models/filter';
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
  filters: Filter[];
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
  filters: [],
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
    filterDream: (state, action: { type: string; payload: Filter[] }) => {
      const filters = action.payload;
      state.filters = filters;

      let dreams: Dream[] = [...state.dreams];

      const filterConditions: Partial<Record<keyof Dream, boolean>> = {
        favorite: (filters.find((p) => p.name === FilterType.Favorite)?.value || false) as boolean,
        recurrent: (filters.find((p) => p.name === FilterType.Recurrent)?.value || false) as boolean,
        nightmare: (filters.find((p) => p.name === FilterType.Nightmare)?.value || false) as boolean,
        paralysis: (filters.find((p) => p.name === FilterType.Paralysis)?.value || false) as boolean,
      };

      for (const [key, value] of Object.entries(filterConditions)) {
        if (value) {
          dreams = dreams.filter((d) => d[key as keyof Dream] === value);
        }
      }

      const hasDateFilter = filters.some((p) => p.name === FilterType.Date);

      if (hasDateFilter) {
        const date = filters.find((p) => p.name === FilterType.Date);
        const from = (date?.value as string[])[0];
        const to = (date?.value as string[])[1];

        dreams = dreams.filter(
          (dream) =>
            moment(dream.createdAt).unix() >= moment(from).unix() && moment(dream.createdAt).unix() <= moment(to).unix()
        );
      }

      state.filteredDreams = filters.length > 0 ? dreams : [];
      state.displayFilteredDreams = getToDisplayDreams(state.filteredDreams);
    },
    searchDream: (state, action: { type: string; payload: string }) => {
      const keyword = action.payload.toLowerCase();

      // TODO: To Apply filters in the search results
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
