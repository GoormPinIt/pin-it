import React, { useState } from 'react';
import { FaRegPlusSquare, FaRegBell } from 'react-icons/fa';
import {
  AiOutlineMessage,
  AiOutlineHome,
  AiOutlineSetting,
} from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Modal from './Modal';

const NavBar: React.FC = () => {
  const nav = useNavigate();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    type: string | null;
  }>({
    isOpen: false,
    title: '',
    type: null,
  });
  const messages = [
    { sender: '가영', text: '안녕하세요', time: '1주' },
    { sender: '민지', text: '잘 지내시죠?', time: '3일' },
    { sender: '철수', text: '반갑습니다', time: '5시간' },
  ];

  const toggleModal = (
    type: string,
    title: string,
    // content: React.ReactNode,
  ) => {
    if (modalState.isOpen && modalState.type === type) {
      setModalState({ isOpen: false, title: '', type: null });
    } else {
      setModalState({ isOpen: true, title, type });
    }
  };
  const handleHomeClick = () => {
    nav('/');
  };

  const handleCreateClick = () => {
    nav('/');
  };

  const handleUpdateClick = () => {
    toggleModal('update', '업데이트');
  };

  const handleMessageClick = () => {
    toggleModal('message', '메시지');
  };

  const handleSettingClick = () => {};
  const closeModal = () => {
    setModalState({ isOpen: false, title: '', type: null });
  };

  return (
    <div className="sticky top-0 left-0  w-10 h-screen bg-gray-100 flex flex-col border-r-2">
      <div className="flex-1 flex flex-col">
        <button className="px-3 py-4" onClick={handleHomeClick}>
          <AiOutlineHome />
        </button>
        <button className="px-3 py-4" onClick={handleCreateClick}>
          <FaRegPlusSquare />
        </button>
        <button className="px-3 py-4" onClick={handleUpdateClick}>
          <FaRegBell />
        </button>
        <button className="px-3 py-4" onClick={handleMessageClick}>
          <AiOutlineMessage />
        </button>
      </div>
      <div>
        <button className="px-3 py-2" onClick={handleSettingClick}>
          <AiOutlineSetting />
        </button>
      </div>
      <Modal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        title={modalState.title}
        messages={modalState.type === 'message' ? messages : undefined}
      />
    </div>
  );
};
export default NavBar;
