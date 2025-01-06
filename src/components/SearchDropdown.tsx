import React, { useState } from 'react';
import SaveModalItem from './SaveModalItem';

interface SearchDropdownProps {
  setBoard: (value: string) => void; // 보드 값 설정 함수
  closeDropdown: () => void; // 드롭다운 닫기 함수
}

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  setBoard,
  closeDropdown,
}) => {
  const [searchText, setSearchText] = useState('');

  const boards = [
    { id: 1, icon: 'https://via.placeholder.com/30', name: '2023' },
    { id: 2, icon: 'https://via.placeholder.com/30', name: '곰돌이 인형' },
    {
      id: 3,
      icon: 'https://via.placeholder.com/30',
      name: '귀여운 고양이 사진',
    },
  ];

  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchText.toLowerCase()),
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
              title={board.name}
              onClick={() => {
                setBoard(board.name); // 선택된 보드 설정
                closeDropdown(); // 드롭다운 닫기
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
          onClick={() => alert('보드 만들기 클릭됨')}
        >
          <span className="font-semibold">+ 보드 만들기</span>
        </button>
      </div>
    </div>
  );
};

export default SearchDropdown;
