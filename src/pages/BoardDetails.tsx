import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { FaUserPlus } from 'react-icons/fa';
import { GoKebabHorizontal } from 'react-icons/go';
import { GiDiamonds } from 'react-icons/gi';
import { HiSquare2Stack } from 'react-icons/hi2';
import EditBoardModal from '../components/EditBoardModal';

type PinData = {
  imageUrl: string;
  title?: string;
};

type BoardData = {
  ownerId: string;
  pins: PinData[];
  title: string;
  updatedTime: string;
  description?: string;
};

const BoardDetails = (): JSX.Element => {
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<BoardData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Firestore에서 보드 데이터 가져오기
  const fetchBoardData = async (boardId: string): Promise<BoardData> => {
    const boardRef = doc(db, 'boards', boardId);
    const boardSnap = await getDoc(boardRef);

    if (boardSnap.exists()) {
      const data = boardSnap.data();
      return {
        ownerId: data.ownerId || '',
        pins: data.pins || [],
        title: data.title || '제목 없음',
        updatedTime: data.updatedTime || new Date().toISOString(),
        description: data.description || '',
      } as BoardData;
    } else {
      throw new Error('보드 데이터를 찾을 수 없습니다.');
    }
  };

  // Firestore에서 Pin 데이터를 가져오기
  const fetchPinData = async (pinIds: string[]): Promise<PinData[]> => {
    const pinsPromises = pinIds.map(async (pinId) => {
      const pinRef = doc(db, 'pins', pinId);
      const pinSnap = await getDoc(pinRef);
      if (pinSnap.exists()) {
        return pinSnap.data() as PinData;
      }
      return null;
    });
    return (await Promise.all(pinsPromises)).filter(
      (pin): pin is PinData => pin !== null,
    );
  };

  useEffect(() => {
    const loadBoardAndPins = async () => {
      if (boardId) {
        try {
          const boardData = await fetchBoardData(boardId);
          const pinsData = await fetchPinData(
            boardData.pins as unknown as string[],
          );
          setBoard({ ...boardData, pins: pinsData });
        } catch (error) {
          console.error('데이터를 가져오는 데 실패했습니다:', error);
        }
      }
    };

    loadBoardAndPins();
  }, [boardId]);

  const handleEditSubmit = async (updatedData: {
    title: string;
    description: string;
  }) => {
    if (!boardId) return;

    try {
      // Firestore에서 보드 데이터 업데이트
      const boardRef = doc(db, 'boards', boardId);
      await updateDoc(boardRef, {
        title: updatedData.title,
        description: updatedData.description,
      });

      // 로컬 상태 업데이트
      setBoard((prevBoard) => ({
        ...prevBoard!,
        title: updatedData.title,
        description: updatedData.description,
      }));
      setShowEditModal(false);
    } catch (error) {
      console.error('보드 업데이트 실패:', error);
      alert('보드를 업데이트하는 중 문제가 발생했습니다.');
    }
  };

  if (!board) {
    return <p>보드 데이터를 로드 중...</p>;
  }

  return (
    <div className="w-full h-screen p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">{board.title}</h2>
          <p className="text-[8px] text-gray-500">핀 {board.pins.length}개</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowModal(!showModal)}
            className="px-2 py-2 mr-6 hover:bg-gray-100 rounded-full"
          >
            <GoKebabHorizontal />
          </button>
          {showModal && (
            <div className="absolute mt-2 right-0 w-24 bg-white shadow-md border p-2 rounded-lg z-10">
              <div className="px-1 py-1 text-gray-500 font-medium text-[7px]">
                보드 옵션
              </div>
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowModal(false);
                }}
                className="block px-1 py-1 hover:bg-gray-100 text-left text-[9px] font-bold w-full"
              >
                보드 수정
              </button>
              <button className="block px-1 py-1 hover:bg-gray-100 text-left text-[9px] font-bold w-full">
                병합
              </button>
              <button className="block px-1 py-1 hover:bg-gray-100 text-left text-[9px] font-bold w-full">
                보관
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col items-start space-y-4 mb-6">
        <button className="p-2 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center">
          <FaUserPlus size={14} />
        </button>

        <div className="flex space-x-1">
          <div className="flex flex-col items-center">
            <button className="p-1 bg-gray-100 rounded-xl w-9 h-9 flex items-center justify-center">
              <GiDiamonds size={16} />
            </button>
            <span className="text-[6px] mt-1 text-center">
              <span className="block">아이디어</span>
              <span className="block">더 보기</span>
            </span>
          </div>

          <div className="flex flex-col items-center">
            <button className="p-1 bg-gray-100 rounded-xl w-9 h-9 flex items-center justify-center">
              <HiSquare2Stack size={16} />
            </button>
            <span className="text-[6px] mt-1">정리하기</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {board.pins.map((pin, index) => (
          <div key={index} className="relative group">
            <img
              src={pin.imageUrl}
              alt={pin.title || `핀 ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
            />
            <button className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-sm rounded hidden group-hover:block">
              삭제
            </button>
          </div>
        ))}
      </div>
      {showEditModal && (
        <EditBoardModal
          board={{
            title: board.title,
            description: board.description || '',
          }}
          onSubmit={handleEditSubmit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default BoardDetails;
