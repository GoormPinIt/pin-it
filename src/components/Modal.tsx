import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaRegPenToSquare } from 'react-icons/fa6';
import LiveMessage from './LiveMessage';
import { io, Socket } from 'socket.io-client';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

interface Message {
  sender: string;
  receiver: string;
  text: string;
  time: string;
}

const socket: Socket = io('http://localhost:4000'); // 소켓 초기화

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chatUsers, setChatUsers] = useState<string[]>([]); // 메시지를 주고받은 사용자
  const [selectedChat, setSelectedChat] = useState<string | null>(null); // 현재 열려 있는 채팅 상대
  const [isNewMessage, setIsNewMessage] = useState(false); // 새 메시지 작성 모드
  const [newMessageReceiver, setNewMessageReceiver] = useState(''); // 새 메시지의 대상 사용자
  const [newMessageText, setNewMessageText] = useState(''); // 새 메시지 텍스트

  useEffect(() => {
    const handleReceive = (data: Message) => {
      setMessages((prev) => ({
        ...prev,
        [data.sender]: [...(prev[data.sender] || []), data],
      }));

      if (!chatUsers.includes(data.sender)) {
        setChatUsers((prev) => [...prev, data.sender]); // 메시지를 주고받은 사용자 추가
      }
    };

    socket.on('receive', handleReceive);

    return () => {
      socket.off('receive', handleReceive);
    };
  }, [chatUsers]);

  const sendMessage = (text: string) => {
    if (selectedChat) {
      const message: Message = {
        sender: 'your_user_id', // 로그인한 사용자 ID
        receiver: selectedChat,
        text,
        time: new Date().toLocaleTimeString(),
      };

      // 서버로 메시지 전송
      socket.emit('send_message', message);

      // 메시지를 로컬 상태에 추가
      setMessages((prev) => ({
        ...prev,
        [selectedChat]: [...(prev[selectedChat] || []), message],
      }));
    }
  };

  const handleNewMessage = () => {
    if (newMessageReceiver && newMessageText) {
      const message: Message = {
        sender: 'your_user_id', // 로그인한 사용자 ID
        receiver: newMessageReceiver,
        text: newMessageText,
        time: new Date().toLocaleTimeString(),
      };

      // 서버로 메시지 전송
      socket.emit('send_message', message);

      // 로컬 상태에 메시지 추가
      setMessages((prev) => ({
        ...prev,
        [newMessageReceiver]: [...(prev[newMessageReceiver] || []), message],
      }));

      if (!chatUsers.includes(newMessageReceiver)) {
        setChatUsers((prev) => [...prev, newMessageReceiver]);
      }

      // 새 메시지 작성 종료
      setIsNewMessage(false);
      setNewMessageReceiver('');
      setNewMessageText('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-12 w-full h-full rounded-lg bg-opacity-50 z-50000 flex justify-start items-center">
      <div className="w-[210px] h-[98%] bg-white shadow-lg rounded-md">
        <div className="p-1 flex justify-between items-center">
          <button className="text-gray-800" onClick={onClose}>
            <IoClose />
          </button>
          <h2 className="text-xs font-bold flex-1 p-2">{title}</h2>
        </div>

        {isNewMessage ? (
          <div>
            <div className="p-1 text-sm font-bold">새 메시지</div>
            <input
              type="text"
              placeholder="대상 사용자 ID"
              className="w-full p-2 text-xs border rounded mb-2"
              value={newMessageReceiver}
              onChange={(e) => setNewMessageReceiver(e.target.value)}
            />
            <textarea
              placeholder="메시지 내용"
              className="w-full p-2 text-xs border rounded mb-2"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-500 text-white py-1 rounded text-xs"
                onClick={handleNewMessage}
              >
                메시지 보내기
              </button>
              <button
                className="flex-1 bg-gray-300 text-black py-1 rounded text-xs"
                onClick={() => setIsNewMessage(false)}
              >
                취소
              </button>
            </div>
          </div>
        ) : !selectedChat ? (
          <div>
            <div
              className="hover:bg-gray-300 rounded-lg cursor-pointer p-2"
              onClick={() => setIsNewMessage(true)}
            >
              <div className="text-xs flex">
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
            <div className="text-xs p-1">
              {chatUsers.length === 0 ? (
                <div className="text-center text-gray-500">
                  대화 상대가 없습니다.
                </div>
              ) : (
                chatUsers.map((user) => (
                  <div
                    key={user}
                    onClick={() => setSelectedChat(user)}
                    className="flex cursor-pointer items-center justify-between pb-2 mb-2 hover:bg-gray-300 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-red-400 w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px]">
                        {user[0]} {/* 사용자 이름의 첫 글자 표시 */}
                      </div>
                      <div>
                        <div className="font-bold text-[10px]">{user}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <LiveMessage
            sender={selectedChat}
            onClose={() => setSelectedChat(null)}
            messages={messages[selectedChat] || []}
            onSendMessage={(text) => sendMessage(text)}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
