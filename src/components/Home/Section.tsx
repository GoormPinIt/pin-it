import React, { useEffect, useState } from 'react';
import Images from './Images';
import Indicator from './Indicator';
import { IoIosArrowDropdownCircle } from 'react-icons/io';
import Button from '../Button';
import { FiSearch } from 'react-icons/fi';
import CardImg from './CardImg';
import './Style.css';
import SignUp from '../../pages/Signup';
import interior1 from '../../assets/img_landingPage/interior1.jpeg';
import interior2 from '../../assets/img_landingPage/interior2.jpeg';
import interior3 from '../../assets/img_landingPage/interior3.jpeg';
import interior4 from '../../assets/img_landingPage/interior4.jpeg';
import interior5 from '../../assets/img_landingPage/interior5.jpeg';
import interior6 from '../../assets/img_landingPage/interior6.jpeg';
import meal1 from '../../assets/img_landingPage/meal1.jpeg';
import meal2 from '../../assets/img_landingPage/meal2.jpeg';
import meal3 from '../../assets/img_landingPage/meal3.jpeg';
import meal4 from '../../assets/img_landingPage/meal4.jpeg';
import meal5 from '../../assets/img_landingPage/meal5.jpeg';
import meal6 from '../../assets/img_landingPage/meal6.jpeg';
import gardening1 from '../../assets/img_landingPage/gardening1.jpeg';
import gardening2 from '../../assets/img_landingPage/gardening2.jpeg';
import gardening3 from '../../assets/img_landingPage/gardening3.jpeg';
import gardening4 from '../../assets/img_landingPage/gardening4.jpeg';
import gardening5 from '../../assets/img_landingPage/gardening5.jpeg';
import gardening6 from '../../assets/img_landingPage/gardening6.jpeg';
import fashion1 from '../../assets/img_landingPage/fashion1.jpeg';
import fashion2 from '../../assets/img_landingPage/fashion2.jpeg';
import fashion3 from '../../assets/img_landingPage/fashion3.jpeg';
import fashion4 from '../../assets/img_landingPage/fashion4.jpeg';
import fashion5 from '../../assets/img_landingPage/fashion5.jpeg';
import fashion6 from '../../assets/img_landingPage/fashion6.jpeg';
const Sec1: React.FC = () => {
  type Message = {
    text: string;
    color: string; // Tailwind CSS 클래스 이름
    img: string[]; // 이미지 링크 배열'
    id: number;
    bgColor: string;
  };

  const Messages: Message[] = [
    {
      text: '저녁 식사 메뉴 아이디어를',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-600',
      img: [meal1, meal2, meal3, meal4, meal5, meal6],
      id: 1,
    },
    {
      text: '집안 꾸미기 아이디어를',
      color: 'text-green-900',
      bgColor: 'bg-green-900',
      img: [interior1, interior2, interior3, interior4, interior5, interior6],
      id: 2,
    },
    {
      text: '새로운 패션을',
      color: 'text-sky-600',
      bgColor: 'bg-sky-600',
      img: [fashion1, fashion2, fashion3, fashion4, fashion5, fashion6],
      id: 3,
    },
    {
      text: '정원 가꾸기 아이디어를',
      color: 'text-green-900',
      bgColor: 'bg-green-900',
      img: [
        gardening1,
        gardening2,
        gardening3,
        gardening4,
        gardening5,
        gardening6,
      ],
      id: 4,
    },
  ];

  const [index, setIndex] = useState<number>(0);
  const handleIndexChange = (newIndex: number) => {
    setIndex(newIndex);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % Messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" flex-col justify-items-center overflow-x-hidden h-screen bg-white relative overflow-y-hidden">
      <h2 className="text-3xl md:text-5xl py-3 pt-32">다음</h2>
      {Messages.map((msg, idx) => (
        <div
          key={msg.id}
          className={`transition-opacity duration-500 justify-center flex-col flex items-center ${
            idx === index ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        >
          <h2
            className={`text-3xl md:text-5xl py-3 m-auto justify-center flex ${msg.color}`}
          >
            {msg.text} 찾아보세요
          </h2>
          <Indicator
            activeIndex={index}
            total={Messages.length}
            messages={Messages}
            onIndexChange={handleIndexChange}
          />
          <Images messages={Messages} activeIndex={index} />
          <IoIosArrowDropdownCircle
            className={`text-5xl rounded-full ${msg.color} absolute bottom-14 z-40 animate-bounce mb-3`}
          />
        </div>
      ))}
      <div className="w-full h-36 absolute bottom-16 bg-gradient-to-t from-white/80 to-transparent"></div>
      <div className="w-full text-center absolute bottom-0 py-6 bg-pinit_yellow font-bold mt-auto ">
        방식은 다음과 같습니다
      </div>
    </div>
  );
};

const Sec2: React.FC = () => {
  return (
    <div className="bg-pinit_yellow md:flex justify-center items-center h-screen overflow-hidden">
      <div className="md:flex-1 md:m-auto relative mt-32">
        <img
          className="w-2/5 h-80 md:h-96 rounded-3xl mx-auto z-20 relative "
          alt="dinner"
          src="https://images.unsplash.com/photo-1605926637512-c8b131444a4b?q=80&w=2980&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <img
          className="w-46 h-56 md:h-64 rounded-3xl absolute left-2/3 -bottom-10"
          alt="dinner"
          src="https://plus.unsplash.com/premium_photo-1677000666741-17c3c57139a2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <img
          className="w-46 h-56 md:h-64 rounded-3xl absolute md:left-32 left-20 top-10 md:top-8"
          alt="dinner"
          src="https://images.unsplash.com/photo-1481931098730-318b6f776db0?q=80&w=3090&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <img
          className="w-36 md:w-44 h-36 md:h-44 rounded-3xl absolute -top-28 left-96"
          alt="dinner"
          src="https://plus.unsplash.com/premium_photo-1672197567645-d6db886af3c2?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        />
        <div className="flex px-2 py-3 md:px-4 md:py-6 absolute items-center bg-white rounded-full z-30 top-32 left-48">
          <FiSearch className="pr-3 font-bold text-4xl" />
          <span className="text-lg md:text-2xl text-rose-950 font-semibold">
            {' '}
            닭고기로 만드는 손쉬운 저녁 메뉴
          </span>
        </div>
      </div>
      <div className="mt-12 md:mt-0 md:flex-1 items-center text-center text-t2_red">
        <h1 className="text-2xl md:text-5xl font-bold my-4">아이디어 검색</h1>
        <p className="text-center text-lg md:text-2xl w-1/2 text-t2-pink mx-auto my-4">
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
    <div className="bg-pinit_mint md:flex justify-center items-center h-screen">
      <div className="flex-1 items-center text-center text-t3_green md:p-0 pt-16">
        <h1 className="text-3xl md:text-5xl font-bold my-4">
          좋아하는 아이디어를 저장하세요.
        </h1>
        <p className="text-center text-xl md:text-2xl w-1/2 mx-auto my-4">
          나중에 다시 볼 수 있도록 좋아하는 콘텐츠를 수집하세요.
        </p>
        <Button className="px-5 py-3">탐색</Button>
      </div>

      <div className="w-full md:w-1/2 h-1/2 md:h-full relative flex flex-wrap justify-start items-start mt-12 md:mt-48">
        <div className="flex w-full">
          <CardImg
            className="w-52 h-52 md:w-96 md:h-96 backdrop-opacity-90 object-fill text-2xl md:text-5xl rounded-3xl"
            text="집 분위기 바꾸기: 양치식물"
            link="https://i.pinimg.com/736x/07/4f/72/074f729bd6f33ad88733b5de8353b9ed.jpg"
          />
          <div className="flex flex-col ml-10">
            <CardImg
              className="md:w-52 w-36 h-36  md:h-52 object-fill text-base md:text-xl text-left mb-10 rounded-3xl"
              text="스칸디나비아풍 침실"
              link="https://i.pinimg.com/736x/3a/e2/6e/3ae26e5b6f93e9d35b2e72e12ec7eced.jpg"
            />
            <CardImg
              className="md:w-44 w-28 h-28 md:h-44 object-fill text-base md:text-xl text-left rounded-3xl"
              text="꿈의 데크"
              link="https://i.pinimg.com/736x/d1/84/f5/d184f5e6fcb73f471f4e59fef62670d9.jpg"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gird-cols-1 w-full md:-mt-24 -mt-80 relative md:ml-0 ml-96 ">
          <CardImg
            className="md:w-60 md:h-60 w-40 h-40 ml-24 object-fill text-xl md:text-3xl text-left rounded-3xl"
            text="멋진 음료 서빙"
            link="https://i.pinimg.com/736x/f9/1e/3e/f91e3e620cedc23ccd85180d90be4b24.jpg"
          />
          <CardImg
            className="md:w-60 md:h-60 w-40 h-40 mt-10 object-fill text-base md:text-xl text-left rounded-3xl"
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
            className="h-60 lg:w-52 lg:h-96 rounded-2xl"
            src="https://i.pinimg.com/736x/23/fb/0e/23fb0ecd992fe6b6a752d2b006b00369.jpg"
            alt=""
          />
          <img
            className="w-14 h-14 lg:w-20 lg:h-20 rounded-full object-cover absolute object-left-top z-10 lg:-bottom-4 lg:-left-10 bottom-3 -left-6"
            src="https://i.pinimg.com/736x/95/2a/b6/952ab62ca02aecde9d4a0ba58c2d0fea.jpg"
            alt=""
          />
          <div className="text-white relative left-14">
            <p className="font-semibold text-xs lg:text-base">Scout the City</p>
            <p className="font-medium text-xs lg:text-base">56.7k followers</p>
          </div>
        </div>
      </div>
      <div className="flex-1 items-center text-center text-t2_red">
        <h1 className="text-3xl md:text-4xl lg:text-5xl text-t2-pink font-bold my-4">
          구매하고, 만들고, <br /> 시도하고, 실행하세요.
        </h1>
        <p className="text-center text-base md:text-xl lg:text-2xl w-1/2 mx-auto my-4">
          무엇보다도 Pinterest에서는 전 세계 사람들의 아이디어와 새로운 것을
          발견할 수 있습니다.
        </p>
        <Button className="px-5 py-3">탐색</Button>
      </div>
    </div>
  );
};

const Sec5: React.FC = () => {
  return (
    <div className="relative backImg flex justify-around items-center h-screen bg-blend-darken overflow-y-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="md:flex-2 md:items-center md:text-center md:z-10 md:opacity-100 opacity-0 md:block hidden">
        <h1 className="text-5xl lg:text-6xl text-white font-semibold my-4 text-left lg:leading-snug leading-normal">
          가입하여 더 많은 <br />
          아이디어를 <br />
          만나 보세요
        </h1>
      </div>
      <div className="rounded-3xl md:w-1/3 lg:w-1/4 h-3/5 z-10 md:flex-2 -mt-full">
        <SignUp />
      </div>
      <div className="absolute w-full bg-white gap-2 lg:gap-4 flex justify-center items-center bottom-0 h-10 text-xs lg:text-sm  font-normal lg:font-semibold">
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
