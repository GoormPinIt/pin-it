import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaLongArrowAltUp } from 'react-icons/fa';

interface LiveMessageProps {
  sender: string;
  receiver: string;
  onClose: () => void;
  messages: { sender: string; text: string; time: string }[];
  onSendMessage: (text: string) => void;
}

const LiveMessage: React.FC<LiveMessageProps> = ({
  sender,
  receiver,
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
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-1 flex justify-between items-center border-b">
        <button className="text-gray-800" onClick={onClose}>
          <IoClose />
        </button>
        <h2 className="text-xs font-bold flex-1 p-2">{receiver}</h2>
      </div>

      <div ref={messageRef} className="flex-1 p-2 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 text-sm p-1 ${
              msg.sender === sender
                ? 'text-right text-blue-400'
                : 'text-left text-gray-800'
            }`}
          >
            <div className="font-bold">{msg.sender}</div>
            <div>{msg.text}</div>
            <div className="text-xs text-gray-500">{msg.time}</div>
          </div>
        ))}
      </div>

      <div className="p-2 border-t flex items-center mb-9">
        <input
          type="text"
          className="flex-1 border p-2 text-[10px] rounded-full "
          placeholder="메시지를 입력하세요..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="ml-2 bg-blue-500 text-white px-2 py-2 rounded-full"
          onClick={handleSendMessage}
        >
          <FaLongArrowAltUp />
        </button>
      </div>
    </div>
  );
};

export default LiveMessage;
