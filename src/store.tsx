import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import boardSlice from './features/boardSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    board: boardSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// useAppDispatch 훅 정의
import { useDispatch } from 'react-redux';
export const useAppDispatch = () => useDispatch<AppDispatch>();
