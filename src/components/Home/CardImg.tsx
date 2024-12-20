import React, { ReactNode } from 'react'

interface ButtonProps {
  text: ReactNode; // 버튼 컴포넌트의 내용
  className?: string;
  link: string; 
}

const CardImg = ({link='' ,text, className=''}:ButtonProps) => {
  return (
    <div className={`overflow-hidden rounded-4xl text-white font-semibold align-text-bottom flex items-baseline relative ${className}`}>
      <img className='w-full h-full object-cover' src={link} alt="" />
      <p className='absolute bottom-8 left-4 w-4/5'>{text}</p>
    </div>
  )
}

export default CardImg
