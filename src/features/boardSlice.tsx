import { createSlice } from '@reduxjs/toolkit';

interface Board {
  board: string;
  key: string;
}

interface BoardState {
  data: Board[];
}

const initialState: BoardState = {
  data: [
    {
      board: 'Cats',
      key: '1',
    },
    {
      board: 'Dogs',
      key: '2',
    },
    {
      board: 'Pigs',
      key: '3',
    },
  ],
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {},
});

export const selectBoards = (state: { board: BoardState }) => state.board.data;
export default boardSlice.reducer;
