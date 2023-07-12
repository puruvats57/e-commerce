import { configureStore, createSlice } from '@reduxjs/toolkit';

// Slice
const nameSlice = createSlice({
  name: 'name',
  initialState: 'User',
  reducers: {
    setName: (state, action) => {
      return action.payload;
    },
  },
});

// Store
const store = configureStore({
  reducer: {
    name: nameSlice.reducer,
  },
});

// Actions
export const { setName } = nameSlice.actions;

export default store;
