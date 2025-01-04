import React from 'react';
import { FaRegHeart } from 'react-icons/fa';
import { RiShare2Line } from 'react-icons/ri';
import { HiDotsHorizontal } from 'react-icons/hi';
import { FaSmile } from 'react-icons/fa';
import { LuSticker } from 'react-icons/lu';
import { AiOutlinePicture } from 'react-icons/ai';

const PinPage = () => {
  return (
    <div className="flex h-screen justify-center">
      {/* 헤더 */}
      <header className="fixed h-[80px] bg-white z-[1000] top-0 left-0 w-full shadow-md flex items-center px-6">
        <div className="text-xl font-semibold">Header</div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="flex w-[80%] border border-gray-200 rounded-3xl overflow-hidden mt-[100px] h-[550px] max-w-[815px] bg-white">
        {/* 좌측 이미지 섹션 */}
        <section className="w-1/2 bg-gray-300 flex items-center justify-center">
          <figure className="rounded-lg overflow-hidden w-full h-full">
            <img
              src="https://i.ibb.co/YQSsxqH/7c22f44da02203123787a1f230cf4e91.jpg"
              alt="이미지 설명"
              className="w-full h-full object-cover"
            />
          </figure>
        </section>

        {/* 우측 콘텐츠 섹션 */}
        <section className="w-1/2 p-6 h-full flex flex-col justify-between">
          <div>
            {/* 아이콘 & 저장 버튼튼 */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-gray-600">
                <FaRegHeart />
                <span className="text-black">4</span>
                <RiShare2Line />
                <HiDotsHorizontal />
              </div>
              <button className="bg-[#e60023] text-white px-4 py-2 rounded-full text-sm font-semibold">
                저장
              </button>
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-semibold mb-4">miffy</h1>

            {/* 사용자 */}
            <header className="flex items-center mb-4">
              <figure className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img
                  src="https://eu.ui-avatars.com/api/?name=John+Doe&size=250"
                  alt="사용자 프로필"
                />
              </figure>
              <span className="font-normal">vicky 🐧</span>
            </header>

            {/* 글 */}
            <p className="text-blue-500 mb-4">
              <a href="#tag" className="hover:underline">
                #miffy
              </a>
            </p>

            {/* 댓글 토글글 */}
            <div className="flex flex-row justify-between items-center">
              <div className="inline-block font-semibold">
                <span className="inline-block">댓글</span>
                <span className="inline-block ml-1">1</span>
                <span className="inline-block">개</span>
              </div>
              <div className="inline-block ml-[7px]">
                <svg
                  aria-label="댓글 열기"
                  className="Uvi gUZ U9O kVc"
                  height="12"
                  role="img"
                  viewBox="0 0 24 24"
                  width="12"
                >
                  <path d="M20.16 6.65 12 14.71 3.84 6.65a2.27 2.27 0 0 0-3.18 0 2.2 2.2 0 0 0 0 3.15L12 21 23.34 9.8a2.2 2.2 0 0 0 0-3.15 2.26 2.26 0 0 0-3.18 0"></path>
                </svg>
              </div>
            </div>
            <article className="chat"></article>
          </div>

          {/* 하단 영역 */}
          <div className="mt-auto">
            {/* 설명 */}
            <p className="text-black font-semibold mb-4">어떠셨나요?</p>

            {/* 댓글 입력란 */}
            <footer className="relative">
              <form>
                <label htmlFor="comment" className="sr-only">
                  댓글 입력
                </label>
                <input
                  id="comment"
                  type="text"
                  placeholder="댓글을 추가..."
                  className="w-full border px-[15px] py-[13px] rounded-full bg-[#e9e9e9] focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
              </form>
              <div className="flex flex-row space-x-2 absolute top-1/2 right-[25px] -translate-y-1/2 ">
                <FaSmile />
                <LuSticker />
                <AiOutlinePicture />
              </div>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PinPage;
