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
  searchResults: Dream[];
  filters: Filter[];
  filteredResults: Dream[];
  displaySearchedDreams: ListDream;
}

const initialState: InitialState = {
  dreams: [],
  displayDreams: {},
  recentFavorite: [],
  recentNightmare: [],
  recentParalysis: [],
  recentRecurrent: [],
  search: '',
  searchResults: [], // Stores results after applying search
  filters: [],
  filteredResults: [], // Stores results after applying filters
  displaySearchedDreams: {},
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
    initializeDream: (state: InitialState, action: { type: string; payload: Dream[] }) => {
      const existingDreamIds = new Set(state.dreams.map((dream) => dream.id));
      // Add only dreams that don't already exist in state.dreams
      const newDreams = action.payload.filter((dream) => !existingDreamIds.has(dream.id));

      state.dreams = [...state.dreams, ...newDreams];
      updateDisplayDreams(state);
    },
    addDream: (state: InitialState, action: { type: string; payload: Dream[] }) => {
      state.dreams = [...state.dreams, ...action.payload];
      updateDisplayDreams(state);
    },
    updateDream: (state: InitialState, action: { type: string; payload: Dream }) => {
      const id = action.payload.id;
      state.dreams = state.dreams.map((dream) => (dream.id === id ? action.payload : dream));
      updateDisplayDreams(state);
    },
    removeDream: (state: InitialState, action: { type: string; payload: string }) => {
      state.dreams = state.dreams.filter((dream) => dream.id !== action.payload);
      updateDisplayDreams(state);
    },
    filterDream: (state: InitialState, action: { type: string; payload: Filter[] }) => {
      const filters = action.payload;
      state.filters = filters;

      // Apply Search before hand if there is a search keyword, otherwise just get all the dreams
      let dreams: Dream[] = state.search
        ? state.dreams.filter(
            (dream) =>
              dream.title.toLowerCase().includes(state.search!) || dream.dream.toLowerCase().includes(state.search!)
          )
        : [...state.dreams];

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

      state.filteredResults = filters.length > 0 ? dreams : state.search ? dreams : [];
      state.displaySearchedDreams = getToDisplayDreams(state.filteredResults);
      state.searchResults = [...state.filteredResults];
    },
    searchDream: (state: InitialState, action: { type: string; payload: string }) => {
      const keyword = action.payload.toLowerCase();

      const dreamsToSearch = state.filters?.length > 0 ? state.filteredResults : state.dreams;
      const searchResults = keyword
        ? dreamsToSearch.filter(
            (dream) => dream.title.toLowerCase().includes(keyword) || dream.dream.toLowerCase().includes(keyword)
          )
        : state.filters?.length > 0
          ? state.filteredResults
          : [];

      state.searchResults = searchResults;
      state.displaySearchedDreams = getToDisplayDreams(state.searchResults);
      state.search = keyword;
    },
    clearSearch: (state: InitialState) => {
      state.search = '';
      state.searchResults = [];
      state.filteredResults = [];
      state.filters = [];
      state.displaySearchedDreams = {};
    },
  },
});

export const { initializeDream, addDream, updateDream, removeDream, searchDream, clearSearch, filterDream } =
  dreamSlice.actions;
export default dreamSlice.reducer;
