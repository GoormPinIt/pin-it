import React, { act, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, setActiveKey, setUserId } from '../features/boardSlice';
import { AppDispatch, RootState } from '../store';
import PinterestLayout from '../components/PinterestLayout';
import StoryList from '../components/StoryList';

const Home = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { boards, activeKey, userId } = useSelector(
    (state: RootState) => state.boards,
  );
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      dispatch(setUserId(user.uid));
    }
  }, [dispatch]);

  // 보드 데이터 가져오기
  useEffect(() => {
    if (userId) {
      dispatch(fetchBoards(userId));
    }
  }, [dispatch, userId]);

  console.log('boards in Home:', boards);
  console.log('userId in Home:', userId);
  return (
    <div className="flex flex-col mt-0">
      <div className="w-11/12 h-30 p-4 mt-2 overflow-x-auto">
        <StoryList />
      </div>
      <PinterestLayout />
    </div>
  );
};

export default Home;
