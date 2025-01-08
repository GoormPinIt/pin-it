import PinterestLayout from '../components/PinterestLayout';
import React, { useState } from 'react';
import StoryList from '../components/StoryList';

const Home = (): JSX.Element => {
  interface Board {
    board: string;
    key: string;
  }
  const [activeKey, setActiveKey] = useState<string | null>(null); // 클릭된 항목의 key 저장

  const handleClick = (key: string) => {
    setActiveKey((prevKey: string | null) => (prevKey === key ? null : key)); // 클릭된 key를 토글
  };

  const Board = [
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
  ];

  return (
    <div className="flex flex-col">
      <div className="w-11/12 h-30 p-4 overflow-x-auto">
        <StoryList />
      </div>

      <div className="h-20 text-center flex items-center justify-start w-full gap-10 pl-3">
        {Board.map((item: Board) => (
          <div className="relative" key={item.key}>
            <h2
              className="font-bold hover:bg-gray-400/30 rounded-xl px-2 py-1 inline-block"
              onClick={() => handleClick(item.key)}
            >
              {item.board}
            </h2>
            {activeKey === item.key && ( // 조건부 렌더링: 클릭된 항목의 span만 표시
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
