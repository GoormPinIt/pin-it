import React from "react";
import { IoClose } from "react-icons/io5";
import { FaLongArrowAltUp } from "react-icons/fa";
interface LiveMessageProps {
  sender: string;
  onClose: () => void;
}

const LiveMessage: React.FC<LiveMessageProps> = ({ sender, onClose }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-1 flex justify-between items-center border-b">
        <button className="text-gray-800" onClick={onClose}>
          <IoClose />
        </button>
        <h2 className="text-xs font-bold flex-1 p-2">{sender}</h2>
      </div>


      <div className="flex-1 p-2 overflow-y-auto">
        <div className="text-sm text-gray-600">
          {sender}
        </div>
      </div>


      <div className="p-1 border-t flex items-center border rounded-3xl mb-2">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          className="flex-1 p-2  w-2 h-1 text-[10px] "
        />
        <button className="ml-2 px-1 py-1 bg-blue-500 text-white rounded-full text-xs">
        <FaLongArrowAltUp />
        </button>
      </div>
    </div>
  );
};

export default LiveMessage;