import React, { useEffect, useState } from 'react';
import SaveModalItem from './SaveModalItem';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { fetchBoards } from '../utils/boards';
import SimpleBoardCreateModal from './SimpleBoardCreateModal';

interface SearchDropdownProps {
  setBoard: (value: string) => void;
  closeDropdown: () => void;
  userId: string | '';
  setSelectedBoardId: (value: string) => void;
}

interface Board {
  id: string;
  description: string;
  isPrivate: boolean;
  ownerIds: string[];
  pins: {
    pinId: string[];
  };
  title: string;
  icon: string;
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  setBoard,
  closeDropdown,
  userId,
  setSelectedBoardId,
}) => {
  const uid = useCurrentUserUid();

  const [searchText, setSearchText] = useState('');
  const [boards, setBoards] = useState<Board[]>([]);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false); // 보드 추가 모달 상태

  const handleBoardModalOpen = () => {
    setIsBoardModalOpen(true); // 보드 추가 모달 열기
  };

  const handleBoardModalClose = async () => {
    setIsBoardModalOpen(false); // 보드 추가 모달 닫기
    const updatedBoards = await fetchBoards(userId);
    setBoards(updatedBoards);
  };

  useEffect(() => {
    const loadBoards = async () => {
      const fetchedBoards = await fetchBoards(userId);
      setBoards(fetchedBoards);
    };

    loadBoards();
  }, [userId]); // userId가 변경될 때만 실행

  // 검색 필터 적용
  const filteredBoards = boards.filter((board) =>
    board.title.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="absolute left-0 top-full mt-2 min-w-[400px] bg-white border border-gray-300 rounded-lg shadow-lg z-50 p-4">
      {/* 검색 입력창 */}
      <input
        type="text"
        placeholder="검색"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full border px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
      />

      {/* 보드 리스트 */}
      <ul className="space-y-2 max-h-60 overflow-y-auto">
        {filteredBoards.length > 0 ? (
          filteredBoards.map((board) => (
            <SaveModalItem
              key={board.id}
              icon={board.icon} // 아이콘 추가
              title={board.title}
              onClick={() => {
                setBoard(board.title); // 선택된 보드 설정
                closeDropdown(); // 드롭다운 닫기
                setSelectedBoardId(board.id);
              }}
            />
          ))
        ) : (
          <li className="text-gray-500">검색 결과가 없습니다.</li>
        )}
      </ul>

      {/* 보드 생성 버튼 */}
      <div className="mt-4">
        <button
          className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          onClick={(e) => {
            e.preventDefault();
            handleBoardModalOpen();
          }}
        >
          <span className="font-semibold">+ 보드 만들기</span>
        </button>
      </div>
      {isBoardModalOpen && (
        <SimpleBoardCreateModal
          currentUserUid={uid || ''}
          onClose={handleBoardModalClose} // 모달 닫기 핸들러
        />
      )}
    </div>
  );
};

export default SearchDropdown;
