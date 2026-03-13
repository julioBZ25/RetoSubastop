import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PreferencesState {
  viewMode: 'grid' | 'table';
}

const initialState: PreferencesState = {
  viewMode: 'grid',
};

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<'grid' | 'table'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setViewMode } = preferencesSlice.actions;

export default preferencesSlice.reducer;
