import React from 'react';
import { useParams } from 'react-router-dom';

type BoardData = {
  id: string;
  title: string;
  images: string[];
};

const boardData: BoardData[] = [
  {
    id: 'all-pins',
    title: '모든 핀',
    images: [
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    ],
  },
  {
    id: 'cats',
    title: '고양이',
    images: [
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    ],
  },
  {
    id: 'travel',
    title: '여행',
    images: [
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
      'https://www.svgrepo.com/show/508699/landscape-placeholder.svg',
    ],
  },
];

const BoardDetails = (): JSX.Element => {
  const { boardId } = useParams<{ boardId: string }>(); // URL 파라미터 추출
  const board = boardData.find((b) => b.id === boardId);

  if (!board) {
    return <p>해당 보드를 찾을 수 없습니다.</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{board.title}</h2>
      <div className="grid grid-cols-3 gap-4">
        {board.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`핀${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

export default BoardDetails;
