import React from 'react';
import Button from '../Button';
import logo from '../../assets/pinit_logo.png';
import { useNavigate } from 'react-router-dom';

const Head = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 w-full overflow-x-hidden h-20 flex justify-between bg-white z-50">
      <div className="pl-2">
        <img className="object-fill h-16 pt-3 lg:pt-0 lg:h-20" src={logo} />
      </div>

      <div className="flex w-4/5 lg:w-2/5 items-center justify-end lg:justify-between">
        <div className="flex justify-end lg:justify-evenly gap-2 lg:gap-4 flex-1 pr-4">
          <p className="text-base font-semibold hover:text-gray-600 duration-75">
            소개
          </p>
          <p className="text-base font-semibold hover:text-gray-600 duration-75">
            비즈니스
          </p>
          <p className="text-base font-semibold hover:text-gray-600 duration-75">
            언론
          </p>
        </div>
        <div className="flex justify-center gap-2 align-middle pr-5">
          <Button
            className="px-3 py-2 !text-base"
            onClick={() => {
              navigate('/login');
            }}
          >
            로그인
          </Button>
          <Button
            className="!bg-gray-200 !text-black px-3 py-2 !hover:bg-gray-300 !text-base"
            onClick={() => navigate('/signup')}
          >
            가입하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Head;
