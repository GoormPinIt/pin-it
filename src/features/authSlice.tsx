import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../firebase';
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';

export interface UserData {
  email: string | null;
  uid: string;
  profileImage?: string;
}

interface AuthState {
  isLoggedIn: boolean;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  initialized: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userData: null,
  loading: false,
  error: null,
  initialized: false,
};

export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (password: string, { rejectWithValue }) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('User not found');

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch }) => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // 사용자가 로그인 상태
          dispatch(loginSuccess({ email: user.email, uid: user.uid }));
        } else {
          // 로컬 스토리지에서 토큰 확인
          const token = localStorage.getItem('authToken');
          if (token) {
            // 토큰이 있으면 서버에 유효성 검증 요청
            // 유효하다면 loginSuccess 디스패치, 아니면 logout 디스패치
          } else {
            dispatch(logout());
          }
        }
        resolve();
      });

      return () => unsubscribe();
    });
  },
);

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
    updateProfileImage: (state, action: PayloadAction<string>) => {
      if (state.userData) {
        state.userData.profileImage = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.isLoggedIn = false;
        state.userData = null;
        state.loading = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
      })
      .addCase(initializeAuth.fulfilled, (state) => {
        state.loading = false;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state) => {
        state.loading = false;
        state.initialized = true;
        state.error = 'Failed to initialize auth';
      });
  },
});

export const { loginSuccess, logout, updateProfileImage } = authSlice.actions;
export default authSlice.reducer;
