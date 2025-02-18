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

type User = {
  id: string;
  name: string;
  profileImage: string;
};

type BoardModalProps = {
  currentUserUid: string;
  imageUrl: string;
  onClose: () => void;
};

const BoardCreateModal: React.FC<BoardModalProps> = ({
  currentUserUid,
  imageUrl,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [boardName, setBoardName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const defaultProfileImage =
    'https://i.pinimg.com/736x/3b/73/a1/3b73a13983f88f8b84e130bb3fb29e17.jpg';
  const exampleImage = imageUrl;

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

  const handleAddUser = (id: string) => {
    setSelectedUsers((prev) =>
      prev.includes(id)
        ? prev.filter((userId) => userId !== id)
        : [...prev, id],
    );
  };

  const createBoard = async (
    boardName: string,
    isPrivate: boolean,
    participants: string[],
  ) => {
    try {
      const boardRef = doc(collection(db, 'boards'));
      const newBoardId = boardRef.id;

      const allParticipants = await Promise.all(
        participants.map(async (participantId) => {
          const userQuery = query(
            collection(db, 'users'),
            where('id', '==', participantId),
          );
          const userSnapshot = await getDocs(userQuery);

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0];
            return userDoc.id;
          } else {
            console.error(
              `ID ${participantId}에 해당하는 문서를 찾을 수 없습니다.`,
            );
            return null;
          }
        }),
      );

      const validUids = allParticipants.filter(
        (uid): uid is string => uid !== null,
      );

      await setDoc(boardRef, {
        title: boardName,
        ownerId: [currentUserUid, ...validUids],
        pins: [],
        description: '',
        updatedTime: new Date(),
        isPrivate,
      });

      // 각 참여자의 createdBoards 필드에 보드 ID 추가
      await Promise.all(
        [currentUserUid, ...validUids].map(async (participantUid) => {
          const userRef = doc(db, 'users', participantUid);
          await updateDoc(userRef, {
            createdBoards: arrayUnion(newBoardId),
          });
          console.log(
            `createdBoards 업데이트됨: ${participantUid}, 보드 ID: ${newBoardId}`,
          );
        }),
      );

      alert('보드가 생성되었습니다.');
      onClose();
    } catch (error) {
      console.error('보드 생성 중 오류:', error);
      alert('보드 생성에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-[9999]">
      <div className="bg-white pt-6 rounded-lg shadow-lg w-[90%] relative h-[580px] max-w-[700px] flex flex-col mt-16">
        <h2 className="text-2xl font-semibold m-4 text-center">보드 만들기</h2>

        <div className="flex flex-row justify-center px-4">
          {/* 이미지 추가 */}
          <img
            src={exampleImage}
            alt="Example"
            className="w-[35%] h-40 object-cover rounded-lg mb-4 ml-6 mr-5"
          />
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

            {/* 참여자 추가 */}
            <div className="relative w-full mb-4">
              <label
                htmlFor="addUser"
                className="block font-medium mb-1 text-sm"
              >
                참여자 추가(선택 사항)
              </label>
              <div>
                <FaSearch className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="addUser"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="이름 또는 이메일로 검색"
                  className="w-full p-2 pl-10 border-2 border-gray-300 rounded-full mb-4"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 유저 리스트 */}
        <div className="flex-grow px-6 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage || defaultProfileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-sm">@{user.id}</p>
                </div>
              </div>
              <button
                onClick={() => handleAddUser(user.id)}
                className={`px-4 py-2 rounded-full ${
                  selectedUsers.includes(user.id)
                    ? 'bg-black text-white'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              >
                {selectedUsers.includes(user.id) ? '추가됨' : '추가'}
              </button>
            </div>
          ))}
        </div>

        {/* 버튼 */}
        <div className="flex justify-between gap-2 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-full hover:bg-gray-400"
          >
            취소
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              const boardName = (
                document.getElementById('boardName') as HTMLInputElement
              )?.value;
              const isPrivate = (
                document.getElementById('privateBoard') as HTMLInputElement
              )?.checked;
              createBoard(boardName, isPrivate, selectedUsers);
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
    </div>
  );
};

export default BoardCreateModal;
