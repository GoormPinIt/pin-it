// store/slices/cardsSlice.ts
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cards: [
    {
      id: 1,
      className: 'w-96 h-96 backdrop-opacity-90 object-fill text-5xl',
      text: 'Fern future home vibes',
      link: 'https://i.pinimg.com/736x/07/4f/72/074f729bd6f33ad88733b5de8353b9ed.jpg',
      position: 'row1',
    },
    {
      id: 2,
      className: 'w-52 h-52 object-fill text-xl text-left mb-10',
      text: 'My Scandinavian bedroom',
      link: 'https://i.pinimg.com/736x/3a/e2/6e/3ae26e5b6f93e9d35b2e72e12ec7eced.jpg',
      position: 'row1',
    },
    {
      id: 3,
      className: 'w-44 h-44 object-fill text-xl text-left',
      text: 'The decking of my dreams',
      link: 'https://i.pinimg.com/736x/d1/84/f5/d184f5e6fcb73f471f4e59fef62670d9.jpg',
      position: 'row1',
    },
    {
      id: 4,
      className: 'w-60 h-60 ml-24 object-fill text-3xl text-left',
      text: 'Serve my drinks in style',
      link: 'https://i.pinimg.com/736x/f9/1e/3e/f91e3e620cedc23ccd85180d90be4b24.jpg',
      position: 'row2',
    },
    {
      id: 5,
      className: 'w-60 h-60 mt-10 object-fill text-xl text-left',
      text: 'Our bathroom upgrade',
      link: 'https://i.pinimg.com/736x/3e/75/eb/3e75eb95dc4642761bf05603828e3caf.jpg',
      position: 'row2',
    },
  ],
};

const cardsImgSlice = createSlice({
  name: 'cards',
  initialState,
  reducers: {},
});

export const selectCards = (state: any) => state.cards.cards;
export default cardsImgSlice.reducer;
