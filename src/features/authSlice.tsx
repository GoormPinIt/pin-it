import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { auth } from '../firebase';
import { db } from '../firebase';
import {
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

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

// 계정 삭제 Thunk
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

// 프로필 이미지 업데이트 Thunk
export const updateProfileImage = createAsyncThunk(
  'auth/updateProfileImage',
  async (
    { uid, profileImage }: { uid: string; profileImage: string },
    { rejectWithValue },
  ) => {
    try {
      const userDoc = doc(db, 'users', uid);
      await updateDoc(userDoc, { profileImage });
      return profileImage;
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  },
);

// 인증 초기화 Thunk
export const initializeAuth = createAsyncThunk(
  'auth/initializeAuth',
  async (_, { dispatch }) => {
    return new Promise<void>((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = doc(db, 'users', user.uid);
            const docSnap = await getDoc(userDoc);

            if (docSnap.exists()) {
              const userData = docSnap.data();
              dispatch(
                loginSuccess({
                  email: user.email,
                  uid: user.uid,
                  profileImage: userData.profileImage || null,
                }),
              );
            } else {
              console.error('사용자 문서를 찾을 수 없습니다.');
              dispatch(logout());
            }
          } catch (error) {
            console.error(
              'Firestore에서 사용자 데이터를 불러오는 중 오류 발생:',
              error,
            );
            dispatch(logout());
          }
        } else {
          dispatch(logout());
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
  },
  extraReducers: (builder) => {
    builder
      // 계정 삭제 처리
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

      // 프로필 이미지 업데이트 처리
      .addCase(updateProfileImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        if (state.userData) {
          state.userData.profileImage = action.payload; // Redux 상태 업데이트
        }
        state.loading = false;
      })
      .addCase(updateProfileImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // 인증 초기화 처리
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

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
