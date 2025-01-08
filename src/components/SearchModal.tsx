import React from 'react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-b-xl p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">최근 검색어</h3>
        {/* 최근 검색어 목록 */}
        <ul>
          <li>최근 검색어 1</li>
          <li>최근 검색어 2</li>
          <li>최근 검색어 3</li>
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-2">인기 검색어</h3>
        {/* 인기 검색어 목록 */}
        <ul>
          <li>인기 검색어 1</li>
          <li>인기 검색어 2</li>
          <li>인기 검색어 3</li>
        </ul>
      </div>
    </div>
  );
};

export default SearchModal;
