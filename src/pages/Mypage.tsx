import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import GridBoard from '../components/GridBoard';
import MasonryLayout from '../components/MasonryLayout';

type BoardData = {
  id: string;
  title: string;
  pinCount: number;
  updatedTime: string;
  images: string[];
};

type BoardProps = BoardData & {
  onBoardClick: (id: string) => void;
};

// 더미 보드 데이터
const boardData: BoardData[] = [
  {
    id: 'all-pins',
    title: '모든 핀',
    pinCount: 9,
    updatedTime: '1시간',
    images: [
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    ],
  },
  {
    id: 'cats',
    title: '고양이',
    pinCount: 6,
    updatedTime: '5시간',
    images: [
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    ],
  },
  {
    id: 'travel',
    title: '여행',
    pinCount: 8,
    updatedTime: '2시간',
    images: [
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    ],
  },
];

const Board = ({
  id,
  title,
  pinCount,
  updatedTime,
  images,
  onBoardClick,
}: BoardProps): JSX.Element => (
  <div
    className="w-56 flex flex-col cursor-pointer"
    onClick={() => onBoardClick(id)}
  >
    {title === '모든 핀' ? (
      <div className="relative w-full h-40">
        {images.slice(0, 5).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`핀${5 - index}`}
            className="absolute w-3/5 h-full object-cover rounded-2xl border-2 border-white"
            style={{ left: `${index * 23}px`, zIndex: 5 - index }}
          />
        ))}
      </div>
    ) : (
      <GridBoard images={images} />
    )}
    <h3 className="text-lg font-semibold mt-2">{title}</h3>
    <div className="flex gap-2">
      <p>핀 {pinCount}개</p>
      <p className="text-gray-500">{updatedTime}</p>
    </div>
  </div>
);

const followingList = [
  {
    id: 'user1',
    name: '홍길동',
    userId: 'hong123',
    profileImage:
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    added: false,
  },
  {
    id: 'user2',
    name: '김철수',
    userId: 'chulsoo456',
    profileImage:
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    added: false,
  },
  {
    id: 'user3',
    name: '이영희',
    userId: 'younghee789',
    profileImage:
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    added: false,
  },
];

const Mypage = (): JSX.Element => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<'created' | 'saved'>('saved');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>('최신순');
  const [boardDataState, setBoardDataState] = useState<BoardData[]>(boardData);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);

  const sortOptions = ['최신순', '알파벳순'];

  const savedPinImages: string[] = [
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
  ];

  const createdPinImages: string[] = [
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
    'https://media.istockphoto.com/id/1147544807/ko/%EB%B2%A1%ED%84%B0/%EC%97%86%EC%8A%B5%EB%8B%88%EB%8B%A4-%EC%8D%B8%EB%84%A4%EC%9D%BC-%EC%9D%B4%EB%AF%B8%EC%A7%80-%EB%B2%A1%ED%84%B0-%EA%B7%B8%EB%9E%98%ED%94%BD.jpg?s=612x612&w=0&k=20&c=d0Ddt3qdtkhxPvpInjBRzLWFjODlfSh3IkKAB6YZwC8=',
  ];

  useEffect(() => {
    const fixedBoard = boardData.find((board) => board.id === 'all-pins');
    const restBoards = boardData.filter((board) => board.id !== 'all-pins');

    const sortedData = restBoards.sort(
      (a, b) => parseInt(a.updatedTime) - parseInt(b.updatedTime)
    );

    setBoardDataState([fixedBoard!, ...sortedData]);
  }, []);

  const handleTabChange = (tab: 'created' | 'saved') => {
    setSelectedTab(tab);
  };

  const handleBoardClick = (id: string): void => {
    navigate(`/board/${id}`);
  };

  const handleSortChange = (option: string) => {
    setSelectedSort(option);
    setIsSortOpen(false);

    // '모든 핀'은 항상 맨 앞에
    const fixedBoard = boardDataState.find((board) => board.id === 'all-pins');
    const restBoards = boardDataState.filter(
      (board) => board.id !== 'all-pins'
    );

    const sortedData = restBoards.sort((a, b) => {
      if (option === '최신순') {
        return parseInt(a.updatedTime) - parseInt(b.updatedTime);
      } else if (option === '알파벳순') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setBoardDataState([fixedBoard!, ...sortedData]);
  };

  const BoardModal = () => {
    const [following, setFollowing] = useState(followingList);

    const handleAddUser = (id: string) => {
      setFollowing((prev) =>
        prev.map((user) =>
          user.id === id ? { ...user, added: !user.added } : user
        )
      );
    };

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold m-4 text-center">
            보드 만들기
          </h2>

          <label htmlFor="boardName" className="block font-medium mb-1">
            이름
          </label>
          <input
            id="boardName"
            type="text"
            placeholder="예: '가고 싶은 곳' 또는 '요리법'"
            className="w-full p-2 border rounded-xl mb-4"
          />

          <div className="flex gap-2 mb-6">
            <input
              id="privateBoard"
              type="checkbox"
              className="w-6 h-6 mt-2 cursor-pointer"
            />
            <div className="flex flex-col justify-center leading-tight">
              <label
                htmlFor="privateBoard"
                className="font-semibold text-base cursor-pointer"
              >
                비밀보드로 유지
              </label>
              <p className="text-gray-500 text-sm mt-1">
                회원님과 참여자만 볼 수 있습니다.
              </p>
            </div>
          </div>

          <div className="relative w-full mb-4">
            <label htmlFor="addUser" className="block font-medium mb-1">
              참여자 추가
            </label>
            <div>
              <FaSearch className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400" />
              <input
                id="addUser"
                type="text"
                placeholder="이름 또는 이메일 검색"
                className="w-full p-2 pl-10 border rounded-xl mb-4"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {following.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-sm">@{user.userId}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddUser(user.id)}
                  className={`px-4 py-2 rounded-full ${
                    user.added
                      ? 'bg-black text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {user.added ? '추가됨' : '추가'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsBoardModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={() => alert('보드 만들기')}
              className="px-4 py-2 bg-[#e60023] text-white rounded-full hover:bg-[#cc001f]"
            >
              만들기
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="pb-4 mb-6 text-center">
        <img
          src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
          alt="프로필 사진"
          className="w-32 h-32 object-cover rounded-full bg-gray-200 mx-auto"
        />
        <h2 className="text-2xl font-bold mt-2">이름</h2>
        <p className="text-gray-600 text-sm">아이디</p>
        <p>팔로워 1명 · 팔로잉 1명</p>
        <div className="mt-4 flex justify-center gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
            공유
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
            프로필 수정
          </button>
        </div>
      </div>

      <div className="flex mb-4 justify-center">
        <button
          onClick={() => handleTabChange('created')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'created'
              ? 'border-b-2 border-black'
              : 'text-gray-500'
          }`}
        >
          생성됨
        </button>
        <button
          onClick={() => handleTabChange('saved')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'saved'
              ? 'border-b-2 border-black'
              : 'text-gray-500'
          }`}
        >
          저장됨
        </button>
      </div>

      {selectedTab === 'saved' ? (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between relative">
              <div>
                <TbAdjustmentsHorizontal
                  size={30}
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="cursor-pointer"
                />

                {isSortOpen && (
                  <div className="absolute mt-2 bg-white border rounded shadow-md z-10">
                    {sortOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className="p-2 hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                      >
                        {option} {selectedSort === option && <FaCheck />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <FaPlus
                  size={30}
                  onClick={() => setIsPlusOpen((prev) => !prev)}
                  className="cursor-pointer"
                />

                {isPlusOpen && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-md">
                    <div
                      onClick={() => {
                        navigate('/create-pin');
                        setIsPlusOpen(false);
                      }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      핀 만들기
                    </div>
                    <div
                      onClick={() => {
                        setIsBoardModalOpen(true);
                        setIsPlusOpen(false);
                      }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      보드 만들기
                    </div>
                  </div>
                )}
              </div>
            </div>

            {isBoardModalOpen && <BoardModal />}
            <div className="flex flex-row flex-wrap gap-5 border-b-2 pb-8">
              {boardDataState.map((board: BoardData) => (
                <Board
                  key={board.id}
                  {...board}
                  onBoardClick={handleBoardClick}
                />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <MasonryLayout images={savedPinImages} />
          </div>
        </>
      ) : (
        <div className="pt-4">
          <MasonryLayout images={createdPinImages} />
        </div>
      )}
    </div>
  );
};

export default Mypage;
