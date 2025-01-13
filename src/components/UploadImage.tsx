import React from 'react';
import { HiArrowUpCircle } from 'react-icons/hi2';

// UploadImage 컴포넌트
const UploadImage: React.FC = () => {
  return (
    <div className="h-[450px] w-[375px] bg-[#e9e9e9] rounded-[5%] border-[2px] border-gray-300 border-dashed">
      {/* 파일 업로드 영역 */}
      <label className="relative m-5 flex flex-col justify-center items-center cursor-pointer h-[90%] rounded-lg text-gray-600 gap-4">
        <HiArrowUpCircle className="text-[40px] text-black" />
        <h2 className="font-normal text-black max-w-[220px] text-center">
          파일을 선택하거나 여기로 끌어다 놓으세요.
        </h2>
        <input id="dropzone-file" type="file" className="hidden" />
        <div className="absolute bottom-4 px-6 text-center text-gray-500 text-[12px] leading-snug">
          Pinterest는 20 MB 미만의 고화질 .jpg 파일 또는 200 MB 미만의 .mp4 파일
          사용을 권장합니다.
        </div>
      </label>
    </div>
  );
};

export default UploadImage;
