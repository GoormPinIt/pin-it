import React, { act, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBoards, setActiveKey, setUserId } from '../features/boardSlice';
import { AppDispatch, RootState } from '../store';
import PinterestLayout from '../components/PinterestLayout';
import StoryList from '../components/StoryList';

interface Board {
  description: string;
  title: string;
  ownerId: string;
  isPrivate: boolean;
}

const Home = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { boards, activeKey, userId } = useSelector(
    (state: RootState) => state.boards,
  );
  const [position, setPosition] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);

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

  useEffect(() => {
    const handleScroll = () => {
      const moving = window.scrollY;
      setVisible(position > moving);
      setPosition(moving);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [position]);

  const handleClick = (key: string) => {
    dispatch(setActiveKey(activeKey === key ? null : key)); // Redux 상태 변경
  };

  console.log('boards in Home:', boards);
  console.log('userId in Home:', userId);
  return (

    <div className="flex flex-col mt-0">
      <div className="w-11/12 h-30 p-4 overflow-x-auto">
        <StoryList />
      </div>
      
      <div
        className={`-mt-2 py-2 fixed z-10 bg-white text-center flex items-center justify-start w-full gap-10 pl-3 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        {boards.map((item: Board, index: number) => (
          <div className="relative" key={index}>
            <h2
              className="hover:bg-gray-400/30 rounded-xl px-2 py-1 inline-block font-medium sm:font-bold sm:text-base lg:font-bold lg:text-base text-sm "
              onClick={() => handleClick(item.title)}
            >
              {item.title}
            </h2>
            {activeKey === item.title && ( // 조건부 렌더링: 클릭된 항목의 span만 표시
              <span className="block bottom-0 w-full bg-black h-0.5 rounded-3xl"></span>
            )}
          </div>
        ))}
      </div>
      <PinterestLayout />
    </div>
  );
};

export default Home;
