import React, { useState, useEffect, useRef } from 'react';
import SaveModalItem from './SaveModalItem';
import { BoardItem } from '../types';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { useFetchBoardItem } from '../hooks/useFetchBoardItem';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

interface SaveDropdownProps {
  onClose: () => void;
  pinId: string;
  items?: { icon?: string; title: string }[]; // `items`를 옵셔널로 설정
}

const SaveDropdown: React.FC<SaveDropdownProps> = ({ pinId, onClose }) => {
  const uid = useCurrentUserUid();
  const { boardItems } = useFetchBoardItem(uid || '');
  const modalRef = useRef<HTMLDivElement>(null);

  const handleBoardClick = async (item: BoardItem, onClose: () => void) => {
    try {
      console.log(`${item.title} 클릭됨`);
      const boardId = item.id;
      console.log('boardId:', boardId);

      // Firestore에서 boardId를 참조하여 문서 가져오기
      const boardRef = doc(db, 'boards', boardId);

      // pins 배열에 새 pinId 추가
      await updateDoc(boardRef, {
        pins: arrayUnion(pinId), // 기존 배열에 새 pinId 추가
      });

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

        {/* 리스트 */}
        <ul className="space-y-2 h-[300px] overflow-y-auto">
          {boardItems.map((item, index) => (
            <SaveModalItem
              key={index}
              icon={item.icon}
              title={item.title}
              onClick={() => {
                handleBoardClick(item, onClose);
              }}
            />
          ))}
        </ul>

        {/* 보드 생성 버튼 */}
        <div className="mt-4 modal-footer">
          <button
            className="flex items-center justify-center w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
            onClick={() => alert('보드 만들기 클릭됨')}
          >
            <span className="font-semibold">+ 보드 만들기</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveDropdown;
