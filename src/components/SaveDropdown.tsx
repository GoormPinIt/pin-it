import React, { useState, useEffect, useRef } from 'react';
import SaveModalItem from './SaveModalItem';
import { BoardItem } from '../types';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { useFetchBoardItem } from '../hooks/useFetchBoardItem';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';
import BoardCreateModal from './BoardCreateModal';

interface SaveDropdownProps {
  onClose: () => void;
  pinId: string;
  imageUrl: string;
  setBoardName: (boardName: string) => void;
  items?: { icon?: string; title: string }[]; // `items`를 옵셔널로 설정
}

const SaveModal: React.FC<SaveDropdownProps> = ({
  pinId,
  onClose,
  imageUrl,
  setBoardName,
}) => {
  const uid = useCurrentUserUid();
  const { boardItems, refresh } = useFetchBoardItem(uid || '');
  const modalRef = useRef<HTMLDivElement>(null);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState<boolean>(false); // 보드 추가 모달 상태

  const handleBoardModalOpen = () => {
    setIsBoardModalOpen(true); // 보드 추가 모달 열기
  };

  const handleBoardModalClose = () => {
    setIsBoardModalOpen(false); // 보드 추가 모달 닫기
    refresh();
  };

  const handleBoardClick = async (
    item: BoardItem,
    onClose: () => void,
    uid: string | null,
  ) => {
    if (!uid) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      console.log(`${item.title} 클릭됨`);
      setBoardName(item.title);
      const boardId = item.id;
      console.log('boardId:', boardId);

      // Firestore에서 boardId를 참조하여 문서 가져오기
      const boardRef = doc(db, 'boards', boardId);
      const userRef = doc(db, 'users', uid);

      // pins 배열에 새 pinId 추가
      await updateDoc(boardRef, {
        pins: arrayUnion(pinId), // 기존 배열에 새 pinId 추가
      });
      updateDoc(userRef, {
        savedPins: arrayUnion(pinId),
      }),
        console.log(`Board ${boardId}의 pins에 ${pinId} 추가 완료`);

      // 모달 닫기
      onClose();
    } catch (error) {
      console.error('pins 추가 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose(); // 모달 외부 클릭 시 닫기
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="bg-white rounded-lg shadow-lg w-11/12 max-w-md px-3 py-6 w-[350px]"
        ref={modalRef}
      >
        {/* 모달 헤더 */}
        <div className="modal-header">
          <h2 className="text-lg font-semibold mb-4 text-center">저장</h2>

          {/* 검색 입력란 */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="검색"
              className="w-full border px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>
        </div>

        {boardItems.length ? (
          <ul className="space-y-2 h-[300px] overflow-y-auto">
            {boardItems.map((item, index) => (
              <SaveModalItem
                key={index}
                icon={item.icon}
                title={item.title}
                onClick={() => {
                  handleBoardClick(item, onClose, uid);
                }}
              />
            ))}
          </ul>
        ) : (
          <div className="h-[300px] flex flex-col justify-center items-center">
            <p className="text-base text-gray-400">보드가 없습니다.</p>
          </div>
        )}

        {/* 보드 생성 버튼 */}
        <div className="mt-4 modal-footer">
          <button
            className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            onClick={handleBoardModalOpen}
          >
            <span className="font-semibold">+ 보드 만들기</span>
          </button>
        </div>

        {isBoardModalOpen && (
          <BoardCreateModal
            imageUrl={imageUrl}
            currentUserUid={uid || ''}
            onClose={handleBoardModalClose} // 모달 닫기 핸들러
          />
        )}
      </div>
    </div>
  );
};

export default SaveModal;
