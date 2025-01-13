import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import boardReducer from './features/boardSlice';
import { useDispatch } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const store = configureStore({
  reducer: {
    auth: authReducer,
    boards: boardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
