import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

type MergeModalProps = {
  currentBoardId: string;
  boardTitle: string;
  pinsCount: number;
  onMerge: (targetBoardId: string) => void;
  onClose: () => void;
};

const MergeModal = ({
  currentBoardId,
  boardTitle,
  pinsCount,
  onMerge,
  onClose,
}: MergeModalProps): JSX.Element => {
  const [boards, setBoards] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsRef = collection(db, 'boards');
        const boardSnap = await getDocs(boardsRef);
        const boardsList = boardSnap.docs
          .filter((doc) => doc.id !== currentBoardId)
          .map((doc) => ({
            id: doc.id,
            title: doc.data().title || '제목 없음',
          }));
        setBoards(boardsList);
      } catch (error) {
        console.log('에러 발생', error);
      }
    };
    fetchBoards();
  }, [currentBoardId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex flex-items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-60 h-60">
        <div className="flex items-end justify-center">
          <h2 className="flex flex-1 justify-center">보드 결합하기</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div className="text-[8px]">
          {boardTitle} 보드와 총 {pinsCount} 개의 핀이 영구적으로 삭제됩니다.
          삭제한 후에는 되돌릴 수 없습니다.
        </div>
        <ul>
          {boards.map((board) => (
            <li key={board.id}>
              <button
                onClick={() => onMerge(board.id)}
                className="w-full text-left p-2 bg-gray-100"
              >
                {board.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MergeModal;
