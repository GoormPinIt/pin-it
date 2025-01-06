import React from 'react';

interface SaveModalItemProps {
  icon?: string; // 아이템 옆에 표시될 이미지 URL (옵션)
  title: string; // 아이템 제목
  buttonLabel?: string; // 버튼 라벨 (옵션)
  onClick: () => void; // 클릭 시 동작
}

const SaveModalItem: React.FC<SaveModalItemProps> = ({
  icon,
  title,
  buttonLabel,
  onClick,
}) => {
  return (
    <li
      className="flex items-center justify-between rounded hover:bg-gray-200 cursor-pointer px-2 py-2 rounded-lg group" // group 클래스 추가
      onClick={onClick}
    >
      <div className="flex items-center">
        {icon && (
          <img src={icon} alt={title} className="w-12 h-12 rounded-lg mr-2" />
        )}
        <span className="font-semibold">{title}</span>
      </div>
      {buttonLabel && (
        <button className="bg-[#e60023] text-white px-4 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {buttonLabel}
        </button>
      )}
    </li>
  );
};

export default SaveModalItem;
