import React, { useState, useEffect, useRef } from 'react';
import Button from './Button';
import { RiShare2Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { savePinToBoard, fetchBoards } from '../features/boardSlice';
import SaveModal from './SaveDropdown';
import { arrayUnion, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { CiImageOn } from 'react-icons/ci';
import { ShareModal } from './Home/ShareModal';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { createPortal } from 'react-dom';

interface PinProps {
  src: string;
  id: string;
  onClose?: () => void;
}

const Pin: React.FC<PinProps> = ({ id, src }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { boards, userId } = useSelector((state: RootState) => state.boards);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [showBoardsList, setShowBoardsList] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [boardName, setBoardName] = useState<string>('');
  const currentUserUid = useCurrentUserUid();
  const shareDivRef = useRef<HTMLDivElement | null>(null);
  // 컴포넌트 마운트 시 보드 목록 가져오기
  // const modalRef = useRef<HTMLDivElement>(null);
  const handleCloseShareModal = () => {
    setIsShareModalOpen((prev) => !prev);
  };

  const handleSaveImage = async () => {
    try {
      const response = await fetch(src, {
        mode: 'cors', // CORS 모드 명시
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      });

      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = url;
      link.download = `pin-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('다운로드 실패:', error);
      // 실패 시 새 탭에서 열기
      window.open(src, '_blank');
    }
  };

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       modalRef.current &&
  //       !modalRef.current.contains(event.target as Node)
  //     ) {
  //       onclose();
  //     }
  //   };
  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, [onclose]);

  useEffect(() => {
    if (userId) {
      console.log('Fetching boards for userId:', userId);
      dispatch(fetchBoards(userId));
    }
  }, [userId]);

  const handleModalClose = () => {
    setShowBoardsList(false);
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('저장');
    setShowBoardsList((prev) => !prev);
  };

  useEffect(() => {
    console.log('isShareModalOpen:', isShareModalOpen);
  }, [isShareModalOpen]);

  const handleSaveToBoard = async (boardId: string, boardTitle: string) => {
    try {
      console.log(`${boardTitle} 클릭됨`);
      setBoardName(boardTitle);
      // Firestore의 board 문서 참조
      const boardRef = doc(db, 'boards', boardId);

      // pins 배열에 새 pinId 추가
      await updateDoc(boardRef, {
        pins: arrayUnion(id),
      });

      console.log(`Board ${boardId}의 pins에 ${id} 추가 완료`);
      alert(`${boardTitle}에 저장되었습니다.`);
      setShowBoardsList(false); // 모달 닫기
    } catch (error) {
      console.error('pins 추가 중 오류 발생:', error);
    }
  };

  const handleQuickSave = async (e: React.MouseEvent) => {
    if (!currentUserUid) {
      alert('로그인이 필요합니다.');
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    console.log('Available boards:', boards); // 현재 boards 상태 확인

    if (!selectedBoard) {
      alert('저장할 보드가 없습니다.');
      return;
    }

    const randomBoard = boards[Math.floor(Math.random() * boards.length)];
    setSelectedBoard(randomBoard);

    try {
      await dispatch(
        savePinToBoard({
          boardId: selectedBoard.id,
          pinId: id,
          userId: currentUserUid,
        }),
      ).unwrap();
      alert(`"${selectedBoard.title}"에 저장되었습니다.`);
      setIsSaved(true);
    } catch (error) {
      console.error('핀 저장 실패:', error);
      alert('저장 실패');
    }
  };

  useEffect(() => {
    if (userId && boards.length > 0) {
      // 컴포넌트 마운트 시 랜덤으로 보드 선택
      const randomBoard = boards[Math.floor(Math.random() * boards.length)];
      setSelectedBoard(randomBoard);
    }
  }, [userId]);

  const handleShareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsShareModalOpen((prev) => !prev);
    console.log('isShareModalOpen:', isShareModalOpen);
    setIsOptionsModalOpen(false);
  };

  return (
    <Link to={`/pin/${id}`}>
      <div className="relative hover:bg-blend-darken mb-4">
        <img src={src} className="w-full object-cover rounded-3xl" />
        <div className="z-10 absolute inset-0 hover:bg-black hover:bg-opacity-50 w-full rounded-3xl opacity-0 hover:opacity-100">
          <button
            className="absolute top-3 rounded-2xl left-3 text-white block py-2 px-3 hover:bg-black/30 font-medium bg-transparent outline-none"
            onClick={handleSaveClick}
          >
            {selectedBoard?.title || '...'}
          </button>
          {showBoardsList && (
            <div
              className="bg-white p-2 pt-4 rounded-xl shadow-lg w-80 absolute bottom-11 z-30 text-black"
              style={{
                left: '40%',
                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
                transform: 'translateX(-50%)', // 중앙 정렬을 위해 추가
              }}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
              }}
            >
              {createPortal(
                <SaveModal
                  // onClose={() => setShowBoardsList(false)}
                  // onSave={handleSaveToBoard}
                  // boards={boards}
                  // selectedBoard={selectedBoard}
                  pinId={id}
                  imageUrl={src}
                  onClose={handleModalClose}
                  setBoardName={setBoardName}
                />,
                document.body,
              )}
            </div>
          )}
          <Button
            className="absolute top-3 right-3 px-5 py-3 z-2 pointer-events-auto"
            onClick={handleQuickSave}
          >
            저장
          </Button>
          <div
            className="absolute bottom-3 w-full flex justify-end gap-1 right-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={shareDivRef}>
              <Button
                className="bg-slate-200 hover:bg-slate-300 rounded-full p-3 z-10 pointer-events-auto"
                onClick={handleShareClick}
              >
                <RiShare2Line className="text-neutral-900 font-black text-sm " />
              </Button>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                style={{
                  width: '96px',
                  position: 'absolute',
                  bottom: '11px',
                  zIndex: '30',
                }}
              >
                {isShareModalOpen &&
                  shareDivRef.current &&
                  createPortal(
                    <ShareModal onClose={handleCloseShareModal} />,
                    document.body,
                  )}
              </div>
              <Button
                className="bg-slate-200 hover:bg-slate-300 rounded-full text-sm p-3 z-10 pointer-events-auto"
                onClick={(e) => {
                  handleSaveImage();
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <CiImageOn className="text-neutral-900" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Pin;
