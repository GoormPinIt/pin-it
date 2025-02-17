import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import {
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
// import { Board } from '../utils/boards';
export interface Board {
  id: string;
  description: string;
  title: string;
  isPrivate: boolean;
  ownerIds: string[];
  ownerId: string;
  pins: {
    pinId: string[];
  };
  icon: string;
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

// 핀을 보드에 저장하는 thunk 추가
export const savePinToBoard = createAsyncThunk(
  'boards/savePinToBoard',
  async ({
    boardId,
    pinId,
    userId,
  }: {
    boardId: string;
    pinId: string;
    userId: string;
  }) => {
    try {
      const boardRef = doc(db, 'boards', boardId);
      const userRef = doc(db, 'users', userId);

      await Promise.all([
        updateDoc(boardRef, {
          pins: arrayUnion(pinId),
        }),
        updateDoc(userRef, {
          savedPins: arrayUnion(pinId),
        }),
      ]);

      return { boardId, pinId, userId };
    } catch (error) {
      console.error('Error saving pin to board:', error);
      throw error;
    }
  },
);
// 비동기로 보드 데이터 가져오기
// export const fetchBoards = createAsyncThunk(
//   'boards/fetchBoards',
//   async (userId: string | null) => {
//     if (!userId) return [];
//     const boardsCollection = collection(db, 'boards');
//     const boardsQuery = query(boardsCollection, where('ownerId', '==', userId));
//     const boardSnapShot = await getDocs(boardsQuery);
//     return boardSnapShot.docs.map((doc) => ({
//       id: doc.id,
//       description: doc.data().description || '',
//       title: doc.data().title || '',
//       ownerIds: doc.data().ownerId || [],
//       pins: {
//         pinId: doc.data().pins?.pinId || [],
//       },
//       icon: doc.data().icon || '',
//       isPrivate: doc.data().isPrivate || false,
//     }));
//   },
// );
// export const fetchBoards = createAsyncThunk(
//   'boards/fetchBoards',
//   async (userId: string | null) => {
//     if (!userId) return [];
//     // 먼저 user 문서에서 createdBoards 배열 가져오기
//     const userDoc = await getDoc(doc(db, 'users', userId));
//     const userData = userDoc.data();
//     const createdBoardIds = userData?.createdBoards || [];
//     // createdBoards의 각 ID로 실제 보드 데이터 가져오기
//     const boardsData = await Promise.all(
//       createdBoardIds.map(async (boardId: string) => {
//         const boardDoc = await getDoc(doc(db, 'boards', boardId));
//         return {
//           id: boardDoc.id,
//           ...boardDoc.data(),
//         };
//       }),
//     );
//     return boardsData;
//   },
// );
export const fetchBoards = createAsyncThunk(
  'boards/fetchBoards',
  async (userId: string | null) => {
    console.log('fetchBoards called with userId:', userId);
    if (!userId) return [];
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      console.log('User data:', userData);
      const createdBoardIds = userData?.createdBoards || [];
      console.log('Created board IDs:', createdBoardIds);
      const boardsData = await Promise.all(
        createdBoardIds.map(async (boardId: string) => {
          const boardDoc = await getDoc(doc(db, 'boards', boardId));
          const data = boardDoc.data();
          console.log('Board data for ID', boardId, ':', data);
          return {
            id: boardDoc.id,
            description: data?.description || '',
            title: data?.title || '',
            isPrivate: data?.isPrivate || false,
            ownerIds: data?.ownerIds || [],
            pins: data?.pins || { pinId: [] },
            icon: data?.icon || '',
          };
        }),
      );
      console.log('Final boards data:', boardsData);
      return boardsData;
    } catch (error) {
      console.error('Error fetching boards:', error);
      throw error;
    }
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
      id: doc.id,
      description: doc.data().description || '',
      title: doc.data().title || '',
      ownerIds: doc.data().ownerId || [],
      pins: {
        pinId: doc.data().pins?.pinId || [],
      },
      icon: doc.data().icon || '',
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
    builder
      .addCase(
        fetchBoards.fulfilled,
        (state, action: PayloadAction<Board[]>) => {
          state.boards = action.payload;
        },
      )
      .addCase(savePinToBoard.fulfilled, (state, action) => {
        const { boardId, pinId } = action.payload;
        // 해당 보드를 찾아서 pins 배열에 pinId 추가
        const board = state.boards.find((board) => board.id === boardId);
        if (board) {
          if (!board.pins.pinId) {
            board.pins.pinId = [];
          }
          if (!board.pins.pinId.includes(pinId)) {
            board.pins.pinId.push(pinId);
          }
        }
      });
  },
});

export const { setActiveKey, setUserId, setCreatedBoards } = boardSlice.actions;
export default boardSlice.reducer;
