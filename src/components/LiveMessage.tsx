import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaLongArrowAltUp } from 'react-icons/fa';

interface LiveMessageProps {
  sender: string;
  onClose: () => void;
  messages: { sender: string; text: string; time: string }[];
  onSendMessage: (text: string) => void;
}

const LiveMessage: React.FC<LiveMessageProps> = ({
  sender,
  onClose,
  messages,
  onSendMessage,
}) => {
  const [message, setMessage] = useState<string>('');
  const messageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };
  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-1 flex justify-between items-center border-b">
        <button className="text-gray-800" onClick={onClose}>
          <IoClose />
        </button>
        <h2 className="text-xs font-bold flex-1 p-2">{sender}</h2>
      </div>

      <div ref={messageRef} className="flex-1 p-2 overflow-y-auto ">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-sm p-1 ${
              msg.sender === sender
                ? 'text-right text-blue-300'
                : 'text-left text-gray-800'
            }`}
          >
            <div className="font-bold">{msg.sender}</div>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="p-1 border-t flex items-center border rounded-3xl mb-2">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-2  w-2 h-1 text-[10px] "
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-1 py-1 bg-blue-500 text-white rounded-full text-xs"
        >
          <FaLongArrowAltUp />
        </button>
      </div>
    </div>
  );
};

export default LiveMessage;
