// src/features/searchSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  searchTerm: string;
}

const initialState: SearchState = {
  searchTerm: '',
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
    },
    resetSearchTerm: (state) => {
      state.searchTerm = '';
    },
  },
});

export const { setSearchTerm, resetSearchTerm } = searchSlice.actions;
export default searchSlice.reducer;
