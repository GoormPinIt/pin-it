import { useState } from 'react';
import PinterestLayout from '../components/PinterestLayout';
import Landing from './LandingPage';

const Home = (): JSX.Element => {
  const [activeKey, setActiveKey] = useState<string | null>(null); // 클릭된 항목의 key 저장

  const handleClick = (key: string) => {
    setActiveKey((prevKey: string | null) => (prevKey === key ? null : key)); // 클릭된 key를 토글
  };

  const data = [
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
      <div className="h-20 text-center flex items-center justify-start w-full gap-10 pl-3">
        {data.map((item) => (
          <div className="relative" key={item.key}>
            <h2
              className="font-extrabold hover:bg-gray-400/30 rounded-xl px-2 py-1 inline-block"
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
