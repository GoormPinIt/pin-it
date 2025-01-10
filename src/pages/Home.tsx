import PinterestLayout from '../components/PinterestLayout';
import React, { act, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveKey, setUserId } from '../features/boardSlice';
import { RootState } from '../store';
import { Board, fetchBoards, setBoards } from '../utils/boards';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

interface User {
  createdAt: string;
  createdBoards: string[];
  createdPins: string[];
  description: string;
  email: string;
  followers: {
    id: string;
    name: string;
  }[];
  following: {
    id: string;
    name: string;
  }[];
}

const Home = (): JSX.Element => {
  const dispatch = useDispatch();
  const { boards, activeKey, userId } = useSelector(
    (state: RootState) => state.boards,
  );
  const [position, setPosition] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      dispatch(setUserId(user.uid));
    }
  }, [dispatch]);

  const loadUserDocument = async (uid: string) => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    console.log('Firestore 문서 데이터:', userDoc.data());
    if (userDoc.exists()) {
      setUser(userDoc.data() as User);
    }
  };
  useEffect(() => {
    const loadUserData = async () => {
      try {
        // 현재 로그인 상태 확인
        const currentUser = auth.currentUser;
        console.log('현재 로그인된 사용자:', currentUser);
        if (!currentUser) {
          // onAuthStateChanged를 사용하여 로그인 상태 변화 감지
          const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth 상태 변경:', user);
            if (user) {
              loadUserDocument(user.uid);
            }
          });
          return () => unsubscribe();
        } else {
          await loadUserDocument(currentUser.uid);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    const loadBoards = async () => {
      if (userId) {
        const boardsData = await fetchBoards(userId);
        dispatch(setBoards(boardsData));
      }
    };
    loadBoards();
  }, [dispatch, userId, user]);

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
      <div
        className={`-mt-2 py-3 fixed z-10 bg-white text-center flex items-center justify-start w-full gap-10 pl-3 ${visible ? 'opacity-100' : 'opacity-0'}`}
      >
        {boards // user?.createdBoards 대신 boards 사용
          .filter((board) => user?.createdBoards.includes(board.id)) // 사용자가 생성한 보드만 필터링
          .map((item: Board) => (
            <div className="relative" key={item.id}>
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
