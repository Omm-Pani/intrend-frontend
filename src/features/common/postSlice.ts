import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PostState {
  platform: string;
  time: string;
}

const initialState: PostState = {
  platform: '',
  time: '',
};

const calendarSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    addPostEvent: (
      state,
      action: PayloadAction<{ platform: string; time: string }>
    ) => {
      const { platform, time } = action.payload;
      state.platform = platform;
      state.time = time;
    },
    resetPlatform: (state) => {
      state.platform = '';
      state.time = '';
    },
  },
});

export const { addPostEvent, resetPlatform } = calendarSlice.actions;

export default calendarSlice.reducer;
