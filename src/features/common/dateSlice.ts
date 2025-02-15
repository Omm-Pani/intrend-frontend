import { createSlice } from '@reduxjs/toolkit';
import { exportTraceState } from 'next/dist/trace';

const dateSlice = createSlice({
  name: 'date',
  initialState: {
    date: '',
  },
  reducers: {
    setDate: (state, action) => {
      state.date = action.payload;
    },
    resetDate: (state) => {
      state.date = '';
    },
  },
});

export const { setDate, resetDate } = dateSlice.actions;
export default dateSlice.reducer;
