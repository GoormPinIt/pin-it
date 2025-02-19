import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  arrayRemove,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { FaUserPlus } from 'react-icons/fa';
import { GoKebabHorizontal } from 'react-icons/go';
import { GiDiamonds } from 'react-icons/gi';
import { HiSquare2Stack } from 'react-icons/hi2';
import EditBoardModal from '../components/EditBoardModal';
import MergeModal from '../components/MergeModal';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import InviteModal from '../components/InviteModal';
type PinData = {
  id?: string;
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
const initialBoardState: BoardData = {
  ownerId: '',
  pins: [],
  title: '',
  updatedTime: '',
  description: '',
};
const BoardDetails = (): JSX.Element => {
  const navigate = useNavigate();
  const { boardId } = useParams<{ boardId: string }>();
  const [board, setBoard] = useState<BoardData>(initialBoardState);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const currentUserUid = useCurrentUserUid();
  const fetchBoardData = async (boardId: string): Promise<BoardData> => {
    const boardRef = doc(db, 'boards', boardId);
    const boardSnap = await getDoc(boardRef);

    if (boardSnap.exists()) {
      const data = boardSnap.data();
      return {
        ownerId: data.ownerId || '',
        pins: data.pins || ([] as string[]),
        title: data.title || '제목 없음',
        updatedTime: data.updatedTime || new Date().toISOString(),
        description: data.description || '',
      } as BoardData;
    } else {
      throw new Error('보드 데이터를 찾을 수 없습니다.');
    }
  };

  useEffect(() => {
    const loadBoardData = async () => {
      if (boardId) {
        try {
          const boardData = await fetchBoardData(boardId);
          setBoard(boardData);
        } catch (error) {
          console.error(error);
        }
      }
    };
    loadBoardData();
  }, [boardId]);

  const handleMerge = async (targetBoardId: string) => {
    if (!board || !boardId || !currentUserUid) return;

    try {
      const targetBoardRef = doc(db, 'boards', targetBoardId);
      const currentBoardRef = doc(db, 'boards', boardId);

      const targetBoardSnap = await getDoc(targetBoardRef);
      const targetPins = targetBoardSnap.exists()
        ? targetBoardSnap.data().pins || []
        : [];

      const newPins = [
        ...targetPins,
        ...board.pins.map((pin) => (typeof pin === 'object' ? pin.id : pin)),
      ];
      await updateDoc(targetBoardRef, {
        pins: newPins,
      });
      const userRef = doc(db, 'users', currentUserUid);
      await updateDoc(userRef, {
        createdBoards: arrayRemove(boardId),
      });

      await deleteDoc(currentBoardRef);

      alert('보드가 성공적으로 병합되었습니다.');
      navigate('/');
      setShowMergeModal(false);
    } catch (error) {
      console.error('보드 병합 실패:', error);
      alert('보드 병합 중 문제가 발생했습니다.');
    }
  };

  const fetchPinData = async (pinIds: string[]): Promise<PinData[]> => {
    const pinsPromises = pinIds.map(async (pinId) => {
      const pinRef = doc(db, 'pins', pinId);
      const pinSnap = await getDoc(pinRef);
      if (pinSnap.exists()) {
        return { ...pinSnap.data(), id: pinSnap.id } as PinData;
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
      const boardRef = doc(db, 'boards', boardId);
      await updateDoc(boardRef, {
        title: updatedData.title,
        description: updatedData.description,
      });

      setBoard((prevBoard) => ({
        ...prevBoard,
        title: updatedData.title,
        description: updatedData.description,
      }));
      setShowEditModal(false);
    } catch (error) {
      console.error('보드 업데이트 실패:', error);
      alert('보드를 업데이트하는 중 문제가 발생했습니다.');
    }
  };
  const handleArchive = async () => {
    if (!boardId) return;

    try {
      const boardRef = doc(db, 'boards', boardId);
      await updateDoc(boardRef, {
        isPrivate: true,
      });
      alert('보드가 저장되었습니다');
    } catch (error) {
      console.error(error);
      alert('문제 발생');
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
          <p className="text-[9px] mt-2">{board.description}</p>
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
              <div className="px-1 py-1 text-gray-500  font-medium text-[7px]">
                보드 옵션
              </div>
              <button
                onClick={() => {
                  setShowEditModal(true);
                  setShowModal(false);
                }}
                className="block px-1 py-1 hover:bg-gray-100 text-left text-[9px] font-bold w-full "
              >
                보드 수정
              </button>
              <button
                className="block px-1 py-1 hover:bg-gray-100 text-left text-[9px] font-bold w-full"
                onClick={() => {
                  setShowMergeModal(true);
                  setShowModal(false);
                }}
              >
                병합
              </button>
              <button
                className="block px-1 py-1 hover:bg-gray-100 text-left text-[9px] font-bold w-full"
                onClick={() => {
                  handleArchive();
                  setShowModal(false);
                }}
              >
                보관
              </button>
            </div>
          )}
          {showMergeModal && (
            <MergeModal
              currentBoardId={boardId ?? 'defaultId'}
              boardTitle={board.title}
              pinsCount={board.pins.length}
              onMerge={handleMerge}
              onClose={() => setShowMergeModal(false)}
            />
          )}
        </div>
      </div>

      <div className="flex flex-col items-start space-y-4 mb-6">
        <button
          onClick={() => setShowInviteModal(true)}
          className="p-2 bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center"
        >
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
            <button
              onClick={() =>
                navigate(`/board/${boardId}/organize`, {
                  state: { pins: board.pins },
                })
              }
              className="p-1 bg-gray-100 rounded-xl w-9 h-9 flex items-center justify-center"
            >
              <HiSquare2Stack size={16} />
            </button>
            <span className="text-[6px] mt-1">정리하기</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
        {board.pins.map((pin, index) => (
          <div key={index} className="relative group">
            <img
              src={pin.imageUrl}
              alt={pin.title || `핀 ${index + 1}`}
              className="w-full h-auto object-cover rounded-lg cursor-pointer"
              onClick={() => navigate(`/pin/${pin.id}`)}
            />
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
      {showInviteModal && (
        <div className="mt-0">
          <InviteModal
            boardId={boardId ?? ''}
            currentUserUid={currentUserUid}
            onClose={() => setShowInviteModal(false)}
          />
        </div>
      )}
    </div>
  );
};

export default BoardDetails;
