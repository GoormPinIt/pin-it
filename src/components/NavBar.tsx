import React, { useState } from 'react';
import { FaRegPlusSquare } from 'react-icons/fa';
import { PiPaintBrushBold } from 'react-icons/pi';
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
    nav('/photo_edit');
  };

  const handleMessageClick = () => {
    toggleModal('message', '메시지');
  };

  const handleSettingClick = () => {
    nav('/settings');
  };
  const closeModal = () => {
    setModalState({ isOpen: false, title: '', type: null });
  };

  return (
    <div className="fixed top-0 left-0  w-16 h-screen flex flex-col border-r-2 z-[100]">
      <div className="flex-1 flex flex-col gap-10 pt-10">
        <button
          className="flex justify-center items-center"
          onClick={handleHomeClick}
        >
          <AiOutlineHome size={25} />
        </button>
        <button
          className="flex justify-center items-center"
          onClick={handleCreateClick}
        >
          <FaRegPlusSquare size={25} />
        </button>
        <button
          className="flex justify-center items-center"
          onClick={handleUpdateClick}
        >
          <PiPaintBrushBold size={25} />
        </button>
        <button
          className="flex justify-center items-center"
          onClick={handleMessageClick}
        >
          <AiOutlineMessage size={25} />
        </button>
      </div>
      <div className="flex justify-center items-center pb-10">
        <button onClick={handleSettingClick}>
          <AiOutlineSetting size={25} />
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
