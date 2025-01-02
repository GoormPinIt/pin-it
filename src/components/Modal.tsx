import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaRegPenToSquare } from 'react-icons/fa6';
import LiveMessage from './LiveMessage';
import { io, Socket } from 'socket.io-client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  messages?: { sender: string; text: string; time: string }[];
}
interface Message {
  sender: string;
  text: string;
  time: string;
}

const socket: Socket = io('http://localhost:4000');

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const [liveMessage, setLiveMessage] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const handleReceive = (data: Message) => {
      setMessages((prev) => {
        if (
          prev.some(
            (msg) =>
              msg.sender === data.sender &&
              msg.text === data.text &&
              msg.time === data.time,
          )
        ) {
          return prev; // 중복 메시지 추가 방지
        }
        return [...prev, data];
      });
    };
    socket.on('receive', handleReceive);

    return () => {
      socket.off('receive', handleReceive);
    };
  }, []);

  const openChatRoom = (sender: string) => {
    setLiveMessage(sender);
  };

  const closeChatRoom = () => {
    setLiveMessage(null);
  };

  const sendNewMessage = (text: string) => {
    const newMessage: Message = {
      sender: 'You',
      text,
      time: new Date().toLocaleTimeString(),
    };

    socket.emit('send_message', newMessage);
    setMessages((prev) => [...prev, newMessage]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-12 w-full h-full rounded-lg bg-opacity-50 z-50000 flex justify-start items-center">
      <div className="w-[210px] h-[98%] bg-white shadow-lg rounded-md">
        {liveMessage ? (
          <LiveMessage
            sender={liveMessage}
            onClose={closeChatRoom}
            messages={messages.filter(
              (msg) => msg.sender === liveMessage || msg.sender === 'Bot',
            )} // 해당 방의 메시지 필터링
            onSendMessage={(text) => {
              const newMessage = {
                sender: 'You',
                text,
                time: new Date().toLocaleTimeString(),
              };

              socket.emit('send_message', newMessage); // 서버로 메시지 전송
              setMessages((prev) => [...prev, newMessage]); // 메시지 상태 업데이트
            }}
          />
        ) : (
          <div>
            <div className="p-1 flex justify-between items-center">
              <button className="text-gray-800" onClick={onClose}>
                <IoClose />
              </button>
              <h2 className="text-xs font-bold flex-1 p-2 ">{title}</h2>
            </div>

            <div
              className="hover:bg-gray-300 rounded-lg cursor-pointer"
              onClick={() => sendNewMessage('새 메시지가 작성됐습니다.')}
            >
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
