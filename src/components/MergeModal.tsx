import {
  collection,
  getDocs,
  doc as getDocRef,
  getDoc,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';

type BoardData = {
  title: string;
  pins?: string[];
  ownerId: string;
};

type PinData = {
  imageUrl: string;
  board?: string;
};

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
  const [boards, setBoards] = useState<
    { id: string; title: string; firstPinImage: string | null }[]
  >([]);

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const boardsRef = collection(db, 'boards');
        const boardSnap = await getDocs(boardsRef);

        const boardsList = await Promise.all(
          boardSnap.docs
            .filter((doc) => doc.id !== currentBoardId)
            .map(async (doc) => {
              const boardData = doc.data() as BoardData;
              const firstPinId = boardData?.pins?.[0] || null;
              let firstPinImage = null;
              if (firstPinId) {
                try {
                  const pinDocRef = getDocRef(db, 'pins', firstPinId);
                  const pinDoc = await getDoc(pinDocRef);
                  if (pinDoc.exists()) {
                    const pinData = pinDoc.data() as PinData;
                    firstPinImage = pinData?.imageUrl || null;
                  } else {
                    console.log(
                      `핀 ID ${firstPinId}에 해당하는 문서를 찾을 수 없습니다.`,
                    );
                  }
                } catch (error) {
                  console.error('핀 데이터를 가져오는 중 오류 발생:', error);
                }
              } else {
                console.log('firstPinId가 null 또는 undefined입니다.');
              }

              return {
                id: doc.id,
                title: boardData.title || '제목 없음',
                firstPinImage,
              };
            }),
        );

        setBoards(boardsList);
      } catch (error) {
        console.error('보드 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchBoards();
  }, [currentBoardId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-[101]">
      <div
        className="bg-white rounded-lg p-6 w-80"
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div className="flex items-end justify-center mb-4">
          <h2 className="text-lg font-bold flex justify-center text-center flex-1">
            보드 결합하기
          </h2>
          <button onClick={onClose} className="text-gray-500">
            X
          </button>
        </div>
        <div className="text-[10px] mb-4">
          {boardTitle} 보드와 총 {pinsCount} 개의 핀이 영구적으로 삭제됩니다.
          삭제한 후에는 되돌릴 수 없습니다.
        </div>
        <ul>
          {boards.map((board) => (
            <li
              key={board.id}
              className="flex items-center p-2 mb-2 bg-gray-100 rounded"
            >
              {board.firstPinImage ? (
                <img
                  src={board.firstPinImage}
                  alt={board.title}
                  className="w-12 h-12 rounded mr-4"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-300 rounded mr-4 flex items-center justify-center">
                  이미지 없음
                </div>
              )}
              <button
                onClick={() => onMerge(board.id)}
                className="text-left text-sm flex-grow"
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
