import React from 'react';
import Button from '../Button';
import logo from '../../assets/pinit_logo.png';
import { useNavigate } from 'react-router-dom';

const Head = () => {
  const navigate = useNavigate();
  return (
    <div className="fixed top-0 w-full h-20 flex justify-between bg-white z-50">
      <div>
        <img className="object-fill h-20" src={logo} />
      </div>

      <div className="flex w-2/5 justify-around items-center">
        <p className="text-base font-semibold hover:text-gray-600 duration-75">
          소개
        </p>
        <p className="text-base font-semibold hover:text-gray-600 duration-75">
          비즈니스
        </p>
        <p className="text-base font-semibold hover:text-gray-600 duration-75">
          언론
        </p>
        <div className="flex justify-center gap-2 w-1/3 align-middle">
          <Button
            className="px-3 py-2 !text-base"
            onClick={() => {
              console.log('ha');
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
