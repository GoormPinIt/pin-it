import React, { useState, useEffect } from 'react';

const TextCarousel: React.FC = () => {
  const [index, setIndex] = useState<number>(0);
  const messages: string[] = [
    '저녁 식사 메뉴 아이디어를',
    '집안 꾸미기 아이디어를',
    '새로운 패션을',
    '정원 가꾸기 아이디어를',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000); // 3초마다 변경

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 정리
  }, []);

  return (
    <div>
      <h2 className="text-5xl py-3">{messages[index]} 찾아보세요</h2>
    </div>
  );
};

export default TextCarousel;
