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
          <div>
            <div className="text-[8px] text-gray-500">설정</div>
            <div className="flex items-center mb-4">
              <input type="checkbox" />
              <label htmlFor="private-board" className="text-[10px]">
                비밀 보드 유지
                <br />
                <span className="text-gray-500">
                  회원님과 참여자만 볼 수 있습니다.
                </span>
              </label>
            </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" />
              <label htmlFor="personal-setting" className="text-[10px] ">
                개인 설정
                <br />
                <span className="text-gray-400">
                  내 홈피드에서 이 보드에 영감을 받은 핀을 봅니다
                </span>
              </label>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-[8px] text-gray-500 mb-2">작업</h3>
            <button className="flex flex-start text-[12px] w-full py-2 rounded">
              보드 삭제
            </button>
            <p className="text-[10px] text-gray-500 mb-4">
              7일이 지나면 삭제된 보드를 복원할 수 없습니다. 이후에는 영구적으로
              삭제됩니다.
            </p>
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
