import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Face, KeyboardArrowDown } from '@mui/icons-material';

const Header: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const navigate = useNavigate();

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white">
      <div className="flex-1 mx-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <form onSubmit={onSearchSubmit}>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 bg-btn_h_gray"
              placeholder="검색"
              onChange={(e) => setInput(e.target.value)}
              value={input}
            />
            <button type="submit" className="hidden"></button>
          </form>
        </div>
      </div>
      <div className="flex items-center">
        <button onClick={() => navigate('/mypage')} className="mx-2">
          <Face className="text-gray-700" />
        </button>
        <div className="relative">
          <button onClick={toggleActive} className="mx-2">
            <KeyboardArrowDown className="text-gray-700" />
          </button>
          {isActive && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
              <button
                onClick={() => {
                  navigate('/mypage');
                  setIsActive(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                프로필
              </button>
              <button
                onClick={() => {
                  // 설정 페이지로 이동하는 로직
                  setIsActive(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                설정
              </button>
              <button
                onClick={() => {
                  // 로그아웃 로직
                  setIsActive(false);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
