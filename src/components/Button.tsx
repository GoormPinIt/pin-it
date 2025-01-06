import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode; // 버튼 컴포넌트의 내용
  className?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className = '',
  onClick,
}) => {
  return (
    <button
      className={`bg-btn_red text-white rounded-3xl font-bold text-ba hover:bg-rose-800 duration-75 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
