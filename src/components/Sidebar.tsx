import React, { useState } from 'react';
import IconButton from './IconButton';

const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 사이드바 상태

  const toggleSidebar = () => setIsExpanded(!isExpanded);

  return (
    <div
      className={`fixed top-[81px] left-0 ${
        isExpanded ? 'w-64' : 'w-20'
      } bg-white border-r border-gray-200 h-full transition-all duration-300 z-[100] `}
    >
      {/* 사이드바 내부 컨텐츠 */}
      <div className="flex flex-col text-center items-center border-b border-[rgb(205, 205, 205)]">
        {/* 토글 버튼 */}
        <IconButton
          onClick={toggleSidebar}
          className="flex items-center justify-center w-[48px] h-[48px] rounded-full bg-white hover:bg-gray-100"
          ariaLabel={isExpanded ? '«' : '»'}
        />
        {/* 플러스 아이콘 버튼 */}
        <IconButton
          ariaLabel="Plus Icon Button"
          onClick={() => console.log('Plus icon clicked')}
          icon={
            <svg
              aria-hidden="true"
              className="fill-current text-black"
              height="20"
              width="20"
              viewBox="0 0 24 24"
            >
              <path d="M22 10h-8V2a2 2 0 0 0-4 0v8H2a2 2 0 0 0 0 4h8v8a2 2 0 0 0 4 0v-8h8a2 2 0 0 0 0-4"></path>
            </svg>
          }
        />
      </div>
    </div>
  );
};

export default Sidebar;
