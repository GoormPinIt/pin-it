import React, { useState, useEffect } from 'react';
import {
  doc,
  setDoc,
  collection,
  updateDoc,
  getDocs,
  query,
  where,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase';
import { FaSearch } from 'react-icons/fa';
import { createPortal } from 'react-dom';

type User = {
  id: string;
  name: string;
  profileImage: string;
};

type BoardModalProps = {
  currentUserUid: string;
  onClose: () => void;
};

const SimpleBoardCreateModal: React.FC<BoardModalProps> = ({
  currentUserUid,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [boardName, setBoardName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (searchTerm === '') {
        setFilteredUsers([]);
      } else {
        const usersQuery = query(
          collection(db, 'users'),
          where('name', '>=', searchTerm),
          where('name', '<=', searchTerm + '\uf8ff'),
        );

        const userSnapshot = await getDocs(usersQuery);
        const allUsers = userSnapshot.docs.map((doc) => ({
          id: doc.data().id,
          name: doc.data().name || '',
          profileImage: doc.data().profileImage || '',
        }));

        setFilteredUsers(allUsers);
      }
    };

    fetchAllUsers();
  }, [searchTerm]);

  const createBoard = async (boardName: string, isPrivate: boolean) => {
    try {
      const boardRef = doc(collection(db, 'boards'));
      const newBoardId = boardRef.id;

      await setDoc(boardRef, {
        title: boardName,
        ownerId: [currentUserUid],
        pins: [],
        description: '',
        updatedTime: new Date(),
        isPrivate,
      });

      // 각 참여자의 createdBoards 필드에 보드 ID 추가

      alert('보드가 생성되었습니다.');
      onClose();
    } catch (error) {
      console.error('보드 생성 중 오류:', error);
      alert('보드 생성에 실패했습니다.');
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]">
      <div className="bg-white pt-6 rounded-lg shadow-lg w-[500px] min-h-[400px] max-w-[700px] flex flex-col relative mt-16 overflow-hidden">
        <h2 className="text-2xl font-semibold m-4 text-center">보드 만들기</h2>

        <div className="flex flex-row justify-center px-4 flex-grow">
          <div className="flex flex-col w-full mr-6 ml-5">
            {/* 이름 입력 */}
            <label htmlFor="boardName" className="block text-sm mb-1">
              이름
            </label>
            <input
              id="boardName"
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              placeholder="예: '가고 싶은 곳' 또는 '요리법'"
              className="w-full p-2 border rounded-xl mb-4"
            />

            {/* 비밀 설정 */}
            <div className="flex gap-2 mb-6">
              <input
                id="privateBoard"
                type="checkbox"
                className="w-6 h-6 mt-2 cursor-pointer"
                checked={isPrivate}
                onChange={() => setIsPrivate((prev) => !prev)}
              />
              <div className="flex flex-col justify-center leading-tight">
                <label
                  htmlFor="privateBoard"
                  className="font-semibold text-sm cursor-pointer"
                >
                  비밀보드로 유지
                </label>
                <p className="text-gray-500 text-sm mt-1">
                  회원님과 참여자만 볼 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 컨테이너 - 항상 하단 고정 */}
        <div className="flex justify-between gap-2 px-6 py-4 border-t bg-white rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              createBoard(boardName, isPrivate);
            }}
            disabled={!boardName.trim()}
            className={`px-4 py-2 rounded-full ${
              boardName.trim()
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            만들기
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default SimpleBoardCreateModal;
