import React from 'react'
import { AiOutlineShareAlt, AiOutlineMore } from "react-icons/ai";
import { HiOutlineCog6Tooth } from "react-icons/hi2";

const ProfileBoardDetail = () => {
  return (
    <div className="p-6">
        
      <div className="flex justify-between items-center">
    
        <div>
          <h1 className="text-2xl font-bold">강아지</h1>
          <p className="text-[10px] text-gray-500">핀 4개</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-gray-200">
            <AiOutlineShareAlt size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-200">
            <AiOutlineMore size={20} />
          </button>
        </div>
      </div>

      
      <div className="flex items-center space-x-2 mt-4">
        <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
          <img
            src="https://via.placeholder.com/32"
            alt="프로필"
            className="w-full h-full object-cover"
          />
        </div>
        <button className="bg-gray-200 text-sm px-3 py-1 rounded-lg hover:bg-gray-300">
          초대
        </button>
      </div>

      
      <div className="flex items-center space-x-2 mt-4">
        <button className="bg-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-300">
          아이디어 더 보기
        </button>
        <button className="bg-gray-200 text-sm px-4 py-2 rounded-lg hover:bg-gray-300">
          정렬하기
        </button>
      </div>

      
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="핀 이미지"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="핀 이미지"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="핀 이미지"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-40 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src="https://via.placeholder.com/150"
            alt="핀 이미지"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};
  

export default ProfileBoardDetail
