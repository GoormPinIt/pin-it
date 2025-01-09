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
          <FaRegBell size={25} />
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
      />
    </div>
  );
};
export default NavBar;
