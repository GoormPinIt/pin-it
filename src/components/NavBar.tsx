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
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    currentChatId: null as string | null,
  });

  const toggleModal = (
    type: string,
    title: string,
    chatId: string | null = null,
  ) => {
    if (modalState.isOpen && modalState.currentChatId === chatId) {
      setModalState({ isOpen: false, title: '', currentChatId: null });
    } else {
      setModalState({ isOpen: true, title, currentChatId: chatId });
    }
  };
  const handleHomeClick = () => {
    nav('/');
  };

  const handleCreateClick = () => {
    nav('/pin-creation-tool');
  };

  const handleUpdateClick = () => {
    toggleModal('update', '업데이트');
  };

  const handleMessageClick = () => {
    toggleModal('message', '메시지');
  };

  const handleSettingClick = () => {
    nav('/settings');
  };
  const closeModal = () => {
    setModalState({ isOpen: false, title: '', currentChatId: null });
  };

  return (
    <div className="sticky top-0 left-0  w-10 h-screen flex flex-col border-r-2 z-[100]">
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
      />
    </div>
  );
};
export default NavBar;
