import { UserProfile } from '@/helper/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UserProfile = {
  username: '',
  token: '',
  email: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<UserProfile>) => {
      return action.payload;
    },
    logoutUser: (state) => {
      state.username = '';
      state.token = '';
      state.email = '';
    },
  },
});
export const { loginUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
