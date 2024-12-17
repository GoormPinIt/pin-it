import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GridBoard from '../components/GridBoard';

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
    updatedTime: '1시간',
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

const Mypage = (): JSX.Element => {
  const navigate = useNavigate();

  const [columnCount, setColumnCount] = useState<number>(6);
  const [selectedTab, setSelectedTab] = useState<'created' | 'saved'>('saved');

  const updateColumnCount = (): void => {
    const columnWidth = 224;
    const gap = 20;
    const columns = Math.floor(window.innerWidth / (columnWidth + gap));
    setColumnCount(columns);
  };

  useEffect(() => {
    updateColumnCount();
    window.addEventListener('resize', updateColumnCount);

    return () => window.removeEventListener('resize', updateColumnCount);
  }, []);

  const pinImages: string[] = [
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

  const getRandomHeight = (): number => {
    const heights = [200, 250, 300, 350, 400];
    return heights[Math.floor(Math.random() * heights.length)];
  };

  const handleTabChange = (tab: 'created' | 'saved') => {
    setSelectedTab(tab);
  };

  const handleBoardClick = (id: string): void => {
    navigate(`/board/${id}`);
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
          <div className="flex flex-row flex-wrap gap-5 border-b-2 pb-8">
            {boardData.map((board: BoardData) => (
              <Board
                key={board.id}
                {...board}
                onBoardClick={handleBoardClick}
              />
            ))}
          </div>

          <div
            className="mt-4"
            style={{
              columnCount: columnCount,
              columnGap: '1rem',
            }}
          >
            {pinImages.map((src: string, index: number) => (
              <img
                key={index}
                src={src}
                alt={`Image ${index + 1}`}
                style={{
                  width: '100%',
                  height: `${getRandomHeight()}px`,
                  marginBottom: '1rem',
                  objectFit: 'cover',
                  borderRadius: '1rem',
                }}
              />
            ))}
          </div>
        </>
      ) : (
        <div
          className="mt-8 pt-4"
          style={{
            columnCount: columnCount,
            columnGap: '1rem',
          }}
        >
          {pinImages.map((src: string, index: number) => (
            <img
              key={index}
              src={src}
              alt={`Image ${index + 1}`}
              style={{
                width: '100%',
                height: `${getRandomHeight()}px`,
                marginBottom: '1rem',
                objectFit: 'cover',
                borderRadius: '1rem',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Mypage;
