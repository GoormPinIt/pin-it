import React, { useState, useEffect } from 'react';
import {
  doc,
  updateDoc,
  arrayUnion,
  query,
  where,
  getDocs,
  collection,
} from 'firebase/firestore';
import { db } from '../firebase';

type InviteModalProps = {
  boardId: string;
  currentUserUid: string | null;
  onClose: () => void;
};

const InviteModal = ({
  boardId,
  currentUserUid,
  onClose,
}: InviteModalProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<
    { id: string; name: string }[]
  >([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const currentUrl = `${window.location.origin}/board/${boardId}`;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!searchTerm) {
          setFilteredUsers([]);
          return;
        }

        const usersQuery = query(
          collection(db, 'users'),
          where('name', '>=', searchTerm),
          where('name', '<=', searchTerm + '\uf8ff'),
        );

        const userSnapshot = await getDocs(usersQuery);
        const users = userSnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name || 'Unknown User',
        }));

        setFilteredUsers(users);
      } catch (error) {
        console.error('사용자 검색 오류:', error);
      }
    };

    fetchUsers();
  }, [searchTerm]);

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleInvite = async () => {
    try {
      if (!boardId || !currentUserUid) return;

      const boardRef = doc(db, 'boards', boardId);
      await updateDoc(boardRef, {
        ownerId: arrayUnion(...selectedUsers),
      });

      alert('참여자를 성공적으로 추가했습니다.');
      onClose();
    } catch (error) {
      console.error('참여자 추가 오류:', error);
      alert('참여자를 추가하는 중 문제가 발생했습니다.');
    }
  };
  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2초 후 복사 완료 메시지 숨김
    });
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-4 rounded-md shadow-md w-96">
        <h2 className="text-sm font-bold mb-4 flex justify-center text-center">
          참여자 초대하기
        </h2>
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={currentUrl}
            readOnly
            className="w-full p-2 border rounded-l-md text-[9px] mr-1"
          />
          <button
            onClick={handleCopyLink}
            className="w-14 py-2 bg-gray-100 text-[8px] px-1 justify-center text-center rounded-md flex items-center"
          >
            {copied ? '복사됨' : '링크 복사'}
          </button>
        </div>
        <input
          type="text"
          placeholder="이름 검색"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-1 border rounded-xl mb-4 text-sm"
        />
        <div className="max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-2 border-b"
            >
              <p>{user.name}</p>
              <button
                className={`px-4 py-2 rounded ${
                  selectedUsers.includes(user.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300'
                }`}
                onClick={() => handleUserSelect(user.id)}
              >
                {selectedUsers.includes(user.id) ? '선택됨' : '선택'}
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          >
            취소
          </button>
          <button
            onClick={handleInvite}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            초대
          </button>
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
