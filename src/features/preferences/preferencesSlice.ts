import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  viewMode: 'grid' | 'table';
  theme: 'light' | 'dark';
}

const initialState: PreferencesState = {
  viewMode: 'grid',
  theme: 'light',
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'grid' | 'table'>) => {
      state.viewMode = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const { setViewMode, toggleTheme } = preferencesSlice.actions;

export default preferencesSlice.reducer;
