import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserData {
  email: string | null;
  uid: string;
}

interface AuthState {
  isLoggedIn: boolean;
  userData: UserData | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<UserData>) {
      state.isLoggedIn = true;
      state.userData = action.payload;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = null;
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
