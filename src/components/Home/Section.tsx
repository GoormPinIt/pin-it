import React from 'react';
import Images from './Images';
import Indicator from './Indicator';
import TextCarousel from './TextCarousel';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import Button from '../Button';
import { FiSearch } from 'react-icons/fi';
import CardImg from './CardImg';
import './Style.css';

const Sec1: React.FC = () => {
  return (
    <div className=" flex-col justify-items-center overflow-x-hidden h-screen bg-white relative">
      <h2 className="text-5xl py-3 pt-32">다음</h2>
      <TextCarousel />
      <Indicator />
      <Images />
      <IoIosArrowDropdownCircle className="text-5xl rounded-full text-white relative z-40 animate-bounce mb-3" />
      <div className="w-full  h-24 absolute bottom-16 bg-gradient-to-t from-white/80 to-transparent"></div>
      <div className="w-full text-center absolute bottom-0 py-6 bg-pinit_yellow font-bold mt-auto ">
        방식은 다음과 같습니다
      </div>
    </div>
  );
};

const Sec2: React.FC = () => {
  return (
    <div className="bg-pinit_yellow flex justify-center items-center h-screen">
      <div className="flex-1 m-auto relative">
        <img
          className="w-2/5 h-96 rounded-3xl mx-auto z-20 relative"
          alt="dinner"
          src="https://images.unsplash.com/photo-1605926637512-c8b131444a4b?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <img
          className="w-46 h-64 rounded-3xl absolute left-2/3 -bottom-10"
          alt="dinner"
          src="https://plus.unsplash.com/premium_photo-1677000666741-17c3c57139a2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <img
          className="w-46 h-64 rounded-3xl absolute left-32 top-8"
          alt="dinner"
          src="https://images.unsplash.com/photo-1481931098730-318b6f776db0?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <img
          className="w-44 h-44 rounded-3xl absolute -top-28 left-96"
          alt="dinner"
          src="https://plus.unsplash.com/premium_photo-1672197567645-d6db886af3c2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <div className="flex px-4 py-6 absolute items-center bg-white rounded-full z-30 top-32 left-48">
          <FiSearch className="pr-3 font-bold text-4xl" />
          <span className="text-2xl text-rose-950 font-semibold">
            {' '}
            닭고기로 만드는 손쉬운 저녁 메뉴
          </span>
        </div>
      </div>
      <div className="flex-1 items-center text-center text-t2_red">
        <h1 className="text-5xl font-bold my-4">아이디어 검색</h1>
        <p className="text-center text-2xl w-1/2 text-t2-pink mx-auto my-4">
          어떤 것을 시도해 보고 싶으세요? &apos;닭고기로 만드는 간단한 저녁
          메뉴&apos;와 같이 관심 있는 내용을 검색하고 결과를 확인해 보세요.
        </p>
        <Button className="px-5 py-3">탐색</Button>
      </div>
    </div>
  );
};

const Sec3: React.FC = () => {
  return (
    <div className="bg-pinit_mint flex justify-center items-center h-screen">
      <div className="flex-1 items-center text-center text-t3_green">
        <h1 className="text-5xl font-bold my-4">
          좋아하는 아이디어를 저장하세요.
        </h1>
        <p className="text-center text-2xl w-1/2 mx-auto my-4">
          나중에 다시 볼 수 있도록 좋아하는 콘텐츠를 수집하세요.
        </p>
        <Button className="px-5 py-3">탐색</Button>
      </div>

      <div className="w-1/2 h-full relative flex flex-wrap justify-start items-start mt-48">
        <div className="flex w-full">
          <CardImg
            className="w-96 h-96 backdrop-opacity-90 object-fill text-5xl rounded-3xl"
            text="집 분위기 바꾸기: 양치식물"
            link="https://i.pinimg.com/736x/07/4f/72/074f729bd6f33ad88733b5de8353b9ed.jpg"
          />
          <div className="flex flex-col ml-10">
            <CardImg
              className="w-52 h-52 object-fill text-xl text-left mb-10 rounded-3xl"
              text="스칸디나비아풍 침실"
              link="https://i.pinimg.com/736x/3a/e2/6e/3ae26e5b6f93e9d35b2e72e12ec7eced.jpg"
            />
            <CardImg
              className="w-44 h-44 object-fill text-xl text-left rounded-3xl"
              text="꿈의 데크"
              link="https://i.pinimg.com/736x/d1/84/f5/d184f5e6fcb73f471f4e59fef62670d9.jpg"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 w-full -mt-24">
          <CardImg
            className="w-60 h-60 ml-24 object-fill text-3xl text-left rounded-3xl"
            text="멋진 음료 서빙"
            link="https://i.pinimg.com/736x/f9/1e/3e/f91e3e620cedc23ccd85180d90be4b24.jpg"
          />
          <CardImg
            className="w-60 h-60 mt-10  object-fill text-xl text-left rounded-3xl"
            text="화장실 업그레이드"
            link="https://i.pinimg.com/736x/3e/75/eb/3e75eb95dc4642761bf05603828e3caf.jpg"
          />
        </div>
      </div>
    </div>
  );
};

const Sec4: React.FC = () => {
  return (
    <div className="bg-pinit_pink flex justify-center items-center h-screen">
      <div className="w-1/2 h-full object-fill relative">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1521038199265-bc482db0f923?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt=""
        />
        <div className="absolute bottom-24 left-24">
          <img
            className="w-52 h-96 rounded-2xl"
            src="https://i.pinimg.com/736x/23/fb/0e/23fb0ecd992fe6b6a752d2b006b00369.jpg"
            alt=""
          />
          <img
            className="w-20 h-20 rounded-full object-cover absolute object-left-top z-10 -bottom-4 -left-10"
            src="https://i.pinimg.com/736x/95/2a/b6/952ab62ca02aecde9d4a0ba58c2d0fea.jpg"
            alt=""
          />
          <div className="text-white relative left-14">
            <p className="font-semibold">Scout the City</p>
            <p className="font-medium">56.7k followers</p>
          </div>
        </div>
      </div>
      <div className="flex-1 items-center text-center text-t2_red">
        <h1 className="text-5xl text-t2-pink font-bold my-4">
          구매하고, 만들고, <br /> 시도하고, 실행하세요.
        </h1>
        <p className="text-center text-2xl w-1/2 mx-auto my-4">
          무엇보다도 Pinterest에서는 전 세계 사람들의 아이디어와 새로운 것을
          발견할 수 있습니다.
        </p>
        <Button className="px-5 py-3">Explore</Button>
      </div>
    </div>
  );
};

const Sec5: React.FC = () => {
  return (
    <div className="relative backImg flex justify-around items-center h-screen bg-blend-darken">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="flex-2 items-center text-center z-10">
        <h1 className="text-6xl text-white font-semibold my-4 text-left leading-snug">
          가입하여 더 많은 <br />
          아이디어를 <br />
          만나 보세요
        </h1>
      </div>
      <div className="bg-white rounded-3xl w-1/4 h-3/4 z-10 flex-2"></div>
      <div className="absolute w-full bg-white gap-4 flex justify-center items-center bottom-0 h-10 text-sm font-semibold">
        <span>서비스 약관</span>
        <span>개인정보처리방침</span>
        <span>도움말</span>
        <span>iPhone 앱</span>
        <span>Android 앱</span>
        <span>사용자</span>
        <span>컬렉션</span>
        <span>쇼핑</span>
        <span>오늘</span>
        <span>탐색</span>
      </div>
    </div>
  );
};

export { Sec1, Sec2, Sec3, Sec4, Sec5 };