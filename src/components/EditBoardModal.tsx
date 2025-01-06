import React from 'react';
import { useState } from 'react';

type EditBoardModalProps = {
  board: { title: string; description: string };
  onSubmit: (updateData: { title: string; description: string }) => void;
  onClose: () => void;
};

const EditBoardModal = ({
  board,
  onSubmit,
  onClose,
}: EditBoardModalProps): JSX.Element => {
  const [title, setTitle] = useState(board.title || '');
  const [description, setDescription] = useState(board.description || '');

  const handleSubmit = () => {
    onSubmit({ title, description });
    onClose();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20000">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex">
          <h2 className="flex flex-1 justify-center">보드 수정</h2>
          <button onClick={onClose}>X</button>
        </div>
        <div>
          <label className="block text-[10px] text-gray-500 ">이름</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded text-[12px]"
          />
          <div className="mb-4">
            <label className="block text-[10px] text-gray-500 ">설명</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded text-[10px]"
              placeholder="무엇에 관한 보드인가요?"
            />
          </div>
          <div>
            <label className="text-[8px] text-gray-500">참여자</label>
          </div>
          <div className="flex justify-end mt-4">
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-red-600 text-white rounded"
            >
              완료
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBoardModal;
