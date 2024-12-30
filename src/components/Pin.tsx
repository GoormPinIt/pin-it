import React from 'react';
import Button from './Button';
import { IoIosMore } from 'react-icons/io';
import { RiShare2Line } from 'react-icons/ri';

// Pin 컴포넌트의 props 타입 정의
interface PinProps {
  src: string; // src는 string 타입이어야 합니다.
}

const Pin: React.FC<PinProps> = ({ src }) => {
  return (
    <div className="relative hover:bg-blend-darken ">
      <img src={src} className="w-full object-cover rounded-3xl" />
      <div className=" absolute inset-0 hover:bg-black hover:bg-opacity-50 w-full rounded-3xl opacity-0 hover:opacity-100">
        <Button className="absolute top-3 right-3 px-5 py-3">저장</Button>
        <div className="absolute bottom-3 w-full flex justify-end gap-1 right-3 ">
          <Button className="bg-slate-200 hover:bg-slate-300 rounded-full p-3">
            <RiShare2Line className="text-neutral-900 font-black text-sm " />
          </Button>
          <Button className="bg-slate-200 hover:bg-slate-300 rounded-full text-sm p-3 ">
            <IoIosMore className="text-neutral-900" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Pin;
