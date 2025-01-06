import React, { useState } from 'react';

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
    { id: 1, name: '2023' },
    { id: 2, name: '곰돌이 인형' },
    { id: 3, name: '귀여운 고양이 사진' },
  ];

  const filteredBoards = boards.filter((board) =>
    board.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <div className="absolute w-64 mx-auto bg-white">
      {/* 검색 입력창 */}
      <input
        type="text"
        placeholder="검색"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:border-blue-400"
      />

      {/* 드롭다운 리스트 */}
      <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
        {/* 필터링된 결과 */}
        {filteredBoards.length > 0 ? (
          filteredBoards.map((board) => (
            <div
              key={board.id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setBoard(board.name); // 선택된 값 부모로 전달
                closeDropdown(); // 드롭다운 닫기
              }}
            >
              {board.name}
            </div>
          ))
        ) : (
          <div className="p-2 text-gray-500">검색 결과가 없습니다.</div>
        )}

        {/* 보드 만들기 버튼 */}
        <div
          className="p-2 text-blue-600 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
          onClick={() => alert('보드 만들기 클릭됨!')}
        >
          + 보드 만들기
        </div>
      </div>
    </div>
  );
};

export default SearchDropdown;
