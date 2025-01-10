import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../firebase';

interface Board {
  description: string;
  title: string;
  ownerId: string;
  isPrivate: boolean;
}

interface BoardSliceState {
  activeKey: string | null;
  userId: string | null;
  createdBoards: Board[]; // Ensure this is properly typed as an array of Board
  boards: Board[];
}

// Example of initial state object
const initialState: BoardSliceState = {
  activeKey: null,
  userId: null,
  createdBoards: [], // Initialize as an empty array
  boards: [],
};

// 비동기로 보드 데이터 가져오기
export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (userId: string | null) => {
    if (!userId) return [];
    const boardsCollection = collection(db, 'boards');
    const boardsQuery = query(boardsCollection, where('ownerId', '==', userId));
    const boardSnapShot = await getDocs(boardsQuery);
    return boardSnapShot.docs.map((doc) => ({
      description: doc.data().description,
      title: doc.data().title,
      ownerId: doc.data().ownerId,
      isPrivate: doc.data().isPrivate,
    })) as Board[];
  },
);

export const fetchCreatedBoards = createAsyncThunk(
  'boards/fetchCreatedBoards',
  async (userId: string | null) => {
    if (!userId) return [];
    const boardsCollection = collection(db, 'boards');
    const boardsQuery = query(boardsCollection, where('ownerId', '==', userId));
    const boardSnapShot = await getDocs(boardsQuery);
    return boardSnapShot.docs.map((doc) => ({
      description: doc.data().description,
      title: doc.data().title,
      ownerId: doc.data().ownerId,
      isPrivate: doc.data().isPrivate,
    })) as Board[];
  },
);

const boardSlice = createSlice({
  name: 'boards',
  initialState,
  reducers: {
    setActiveKey: (state, action: PayloadAction<string | null>) => {
      state.activeKey = action.payload;
    },
    setUserId: (state, action: PayloadAction<string | null>) => {
      state.userId = action.payload;
    },
    setCreatedBoards(state, action: PayloadAction<Board[]>) {
      state.createdBoards = action.payload; // createdBoard 업데이트
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchBoards.fulfilled,
      (state, action: PayloadAction<Board[]>) => {
        state.boards = action.payload;
      },
    );
  },
});

export const { setActiveKey, setUserId, setCreatedBoards } = boardSlice.actions;
export default boardSlice.reducer;
