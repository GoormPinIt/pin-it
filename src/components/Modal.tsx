import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaRegPenToSquare } from 'react-icons/fa6';
import LiveMessage from './LiveMessage';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  messages?: Array<{ sender: string; text: string; time: string }>;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, messages }) => {
  const [liveMessage, setLiveMessage] = useState<string | null>(null);

  const openChatRoom = (sender: string) => {
    setLiveMessage(sender);
  };

  const closeChatRoom = () => {
    setLiveMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-12 w-full h-full rounded-lg bg-opacity-50 z-50 flex justify-start items-center">
      <div className="w-[180px] h-[98%] bg-white shadow-lg rounded-md">
        {liveMessage ? (
          <LiveMessage sender={liveMessage} onClose={closeChatRoom} />
        ) : (
          <div>
            <div className="p-1 flex justify-between items-center">
              <button className="text-gray-800" onClick={onClose}>
                <IoClose />
              </button>
              <h2 className="text-xs font-bold flex-1 p-2 ">{title}</h2>
            </div>
            <div className="hover:bg-gray-300 rounded-lg cursor-pointer">
              <div className="text-xs flex p-2">
                <button className="bg-red-600 rounded-full w-5 h-5 items-center justify-center">
                  <FaRegPenToSquare
                    style={{ fontSize: '12px', lineHeight: '1' }}
                    className="text-[15px] ml-1"
                    color="#fff"
                  />
                </button>
                새 메시지
              </div>
            </div>
            <div className="text-[8px] p-2">메시지</div>
            <div className="text-xs p-1 ">
              {messages &&
                messages.map((msg, index) => (
                  <div
                    key={index}
                    onClick={() => openChatRoom(msg.sender)}
                    className="flex cursor-pointer items-center justify-between pb-2 mb-2 hover:bg-gray-300 rounded-lg"
                  >
                    <div className="flex items-center gap-2 ">
                      <div className="bg-red-400 w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px]">
                        {msg.sender}
                      </div>
                      <div>
                        <div className="font-bold text-[10px]">
                          {msg.sender}
                        </div>
                        <div className="text-[9px] text-gray-400">
                          {msg.text}
                        </div>
                      </div>
                    </div>
                    <div className="text-[7px] text-gray-400">{msg.time}</div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
