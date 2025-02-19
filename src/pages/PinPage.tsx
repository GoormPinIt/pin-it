import { FaRegHeart } from 'react-icons/fa';
import { RiShare2Line } from 'react-icons/ri';
import { HiDotsHorizontal } from 'react-icons/hi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useFetchBoardItem } from '../hooks/useFetchBoardItem';

import { BoardItem } from '../types';
import { toast } from 'react-toastify';
import { HiOutlineSave } from 'react-icons/hi';

import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { addCommentToFirestore } from '../utils/firestoreUtils';

// import { FaSmile } from 'react-icons/fa';
// import { LuSticker } from 'react-icons/lu';
// import { AiOutlinePicture } from 'react-icons/ai';
import SaveModal from '../components/SaveDropdown';
import ProfileComment from '../components/ProfileComment';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  arrayUnion,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  where,
  query,
  arrayRemove,
  collection,
} from 'firebase/firestore';
import UserTag from '../components/UserTag';

interface PinData {
  pinId: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  board: string;
  tag: string;
  allowComments: boolean;
  showSimilarProducts: boolean;
  userId: string;
}

interface Comment {
  commentId: string; // 댓글 ID
  content: string; // 댓글 내용
  pinId: string; // 연결된 핀의 ID
  nickname: string;
  userId: string; // 댓글 작성자 ID
  parentCommentId: string | null; // 부모 댓글 ID (null이면 일반 댓글)
}

const PinPage: React.FC = () => {
  const { pinId } = useParams<{ pinId: string }>(); // URL에서 pinId 추출
  const [userId, setUserId] = useState<string | null>(null);
  const [pinData, setPinData] = useState<PinData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태 관리
  const [isCommentOpen, setIsCommentOpen] = useState(false); // 모달 상태 관리
  const modalRef = useRef<HTMLDivElement>(null); // 모달 영역 감지용 ref
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState('');
  const [boardName, setBoardName] = useState<string>('');
  const { boardItems, refresh } = useFetchBoardItem(userId || '');

  const [savedState, setSavedState] = useState({
    isSaved: false,
    boardName: '보드 선택',
    boardId: '',
  });

  useEffect(() => {
    if (userId && pinId) {
      checkIfPinSaved();
    }
  }, [userId, pinId]);

  const handleDelete = async () => {
    if (!savedState.boardId || !pinId) return;
    try {
      const boardRef = doc(db, 'boards', savedState.boardId);
      await updateDoc(boardRef, {
        pins: arrayRemove(pinId),
      });
      setSavedState({ isSaved: false, boardName: '보드 선택', boardId: '' });
      toast.success(`핀이 보드에서 삭제되었습니다.`);

      console.log(
        `핀 ${pinId}이 보드 ${savedState.boardId}에서 삭제되었습니다.`,
      );

      await checkIfPinSaved();
    } catch (error) {
      console.error('핀 삭제 중 오류 발생:', error);
    }
  };

  const handleSave = async () => {
    if (boardName === '보드 선택') {
      toast.error(`보드가 존재하지 않습니다. 생성해주세요`);

      return;
    }

    if (!userId || !pinId) {
      console.error('userId 또는 pinId가 존재하지 않습니다.');
      return;
    }

    try {
      const boardRef = doc(db, 'boards', boardItems[0].id);
      const userRef = doc(db, 'users', userId);

      await updateDoc(boardRef, {
        pins: arrayUnion(pinId),
      });

      await updateDoc(userRef, {
        savedPins: arrayUnion(pinId),
      });

      toast.success(`핀이 보드에 저장되었습니다.`);

      console.log(`핀 ${pinId}이 보드 ${boardItems[0].id}에 저장되었습니다.`);
    } catch (error) {
      console.error('핀 저장 중 오류 발생:', error);
    }
    await checkIfPinSaved();
  };

  const handleSaveImage = () => {
    const imgURL = pinData?.imageUrl; // 이미지 URL

    if (!imgURL) {
      console.error('이미지 URL이 없습니다.');
      return;
    }

    fetch(imgURL) // (1) CORS 모드 제거
      .then((response) => {
        if (!response.ok) {
          throw new Error('이미지를 가져오는 데 실패했습니다.');
        }
        return response.blob(); // (2) Blob 데이터 변환
      })
      .then((blob) => {
        const blobURL = window.URL.createObjectURL(blob); // (3) Blob을 Object URL로 변환
        const link = document.createElement('a'); // (4) 다운로드 링크 생성
        link.href = blobURL;

        // 파일 이름 설정 (현재 날짜와 시간 기반)
        const now = new Date();
        const timestamp = now
          .toISOString()
          .replace(/[-:.T]/g, '')
          .slice(0, 14);
        link.download = `image-${timestamp}.png`; // (5) 저장될 파일명 설정

        document.body.appendChild(link);
        link.click(); // (6) 자동 클릭하여 다운로드 실행
        document.body.removeChild(link); // (7) 링크 제거

        window.URL.revokeObjectURL(blobURL); // (8) 메모리 해제
      })
      .catch((error) => {
        console.error('이미지 다운로드 중 오류 발생:', error);

        // 실패 시 새 탭에서 이미지 열기
        window.open(imgURL, '_blank');
      });
  };

  const checkIfPinSaved = async () => {
    if (!userId || !pinId) return;
    try {
      const boardsRef = collection(db, 'boards');
      const q = query(boardsRef, where('ownerId', 'array-contains', userId));
      const querySnapshot = await getDocs(q);

      for (const docSnap of querySnapshot.docs) {
        const data = docSnap.data();
        if (data.pins?.includes(pinId)) {
          setSavedState({
            isSaved: true,
            boardName: data.title,
            boardId: docSnap.id,
          });
          return;
        }
      }
      setSavedState({ isSaved: false, boardName: '보드 선택', boardId: '' });
    } catch (error) {
      console.error('핀 저장 여부 확인 중 오류:', error);
    }
  };

  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달 열기
  };

  useEffect(() => {
    // setBoardName('강아지');
    if (boardItems.length) {
      setBoardName(boardItems[0].title);
    } else {
      setBoardName('보드 선택');
    }
    checkIfPinSaved();
  }, [boardItems]);

  useEffect(() => {
    if (userId) {
      refresh();
    }
  }, [userId]);

  useEffect(() => {
    checkIfPinSaved();
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
    checkIfPinSaved();
  };

  const handleReplyClick = (commentId: string) => {
    console.log(`답변 버튼 클릭됨! 댓글 ID: ${commentId}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsModalOpen(false); // 모달 닫기
      }
    };

    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen]);

  useEffect(() => {
    const fetchPinData = async () => {
      if (!pinId) return;
      try {
        setIsLoading(true);
        const docRef = doc(db, 'pins', pinId); // Firestore에서 pinId로 문서 참조
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPinData({ ...docSnap.data(), pinId } as PinData);
        } else {
          console.error('문서가 없습니다.');
        }
      } catch (error) {
        console.error('불러오는 과정에서 에러가 발생했습니다.', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPinData();

    const fetchCommentsData = async () => {
      if (!pinId) return;
      try {
        setIsLoading(true);
        const commentsRef = collection(db, 'comment');
        const q = query(
          commentsRef,
          where('pinId', '==', pinId),
          where('parentCommentId', '==', ''),
        );

        const querySnapshot = await getDocs(q); // Firestore에서 데이터 가져오기

        const fetchedComments: Comment[] = querySnapshot.docs.map((doc) => ({
          commentId: doc.id, // 문서 ID
          content: doc.data().content || '',
          pinId: doc.data().pinId || '',
          nickname: doc.data().nickname || '',
          userId: doc.data().userId || '',
          parentCommentId: doc.data().parentCommentId || null, // Firestore에서 가져온 parentCommentId
        }));
        setComments(fetchedComments); // 댓글 상태에 저장
        console.log(comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCommentsData();
  }, [pinId]);

  const handleAddComment = async (userId: string): Promise<void> => {
    try {
      if (!comment.trim()) return;

      const userDocRef = doc(db, 'users', userId);

      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userName = userDoc.data().name;
        console.log('User Name:', userName);

        const newComment = {
          commentId: uuidv4(),
          content: comment,
          nickname: userName,
          parentCommentId: '',
          pinId: pinId || '',
          userId: userId || '',
        };

        addCommentToFirestore(newComment)
          .then(() => {
            setComments([...comments, newComment]); // 로컬 상태 갱신
            setComment(''); // 입력 필드 초기화
          })
          .catch((error) => {
            console.error('Error adding comment to Firestore:', error);
          });

        setIsCommentOpen(true);
      } else {
        console.log('No such user document!');
        return;
      }
    } catch (error) {
      console.error('Error fetching user name:', error);
      return;
    }
  };

  useEffect(() => {
    console.log('Saved state updated:', savedState);
  }, [savedState]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe(); // 언마운트 시 구독 해제
  }, []);

  return (
    <div className="flex h-screen justify-center mt-3">
      {/* 메인 콘텐츠 */}
      <main className="flex w-[80%] border border-gray-200 rounded-3xl overflow-hidden mt-[5px] h-[550px] max-w-[815px] bg-white">
        {/* 좌측 이미지 섹션 */}
        <section className="w-1/2 bg-gray-300 flex items-center justify-center">
          <figure className="overflow-hidden w-full h-full">
            <img
              src={pinData?.imageUrl}
              alt="이미지 설명"
              className="w-full h-full object-contain"
            />
          </figure>
        </section>

        {/* 우측 콘텐츠 섹션 */}
        {/* 우측 콘텐츠 섹션 */}
        {/* 우측 콘텐츠 섹션 */}
        <section className="w-1/2 pl-3 h-full flex flex-col">
          {/* 헤더 영역 */}
          <header className="sticky top-0 bg-white z-10 px-2 pt-3">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 text-black text-xl font-extrabold max-w-[400px]">
                <button onClick={handleSaveImage}>
                  <HiOutlineSave />
                </button>
              </div>
              {savedState.isSaved ? (
                <div className="flex items-center gap-x-1">
                  <div className="flex items-center bg-white hover:bg-[#e2e2e2] px-4 py-2 rounded-full">
                    <button className="text-black text-sm font-semibold">
                      {boardName}
                    </button>
                  </div>
                  <button
                    onClick={handleDelete}
                    className="bg-black text-white px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    저장됨
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-x-1">
                  <div
                    className="flex items-center bg-white hover:bg-[#e2e2e2] px-4 py-2 rounded-full"
                    onClick={handleModalOpen}
                  >
                    <button className="text-black text-sm font-semibold">
                      {boardName}
                    </button>
                    <svg
                      aria-label="보드 목록 열기"
                      className="ml-2 cursor-pointer"
                      height="12"
                      role="img"
                      viewBox="0 0 24 24"
                      width="12"
                    >
                      <path d="M20.16 6.65 12 14.71 3.84 6.65a2.27 2.27 0 0 0-3.18 0 2.2 2.2 0 0 0 0 3.15L12 21 23.34 9.8a2.2 2.2 0 0 0 0-3.15 2.26 2.26 0 0 0-3.18 0"></path>
                    </svg>
                  </div>
                  <button
                    onClick={handleSave}
                    className="bg-[#e60023] text-white px-4 py-2 rounded-full text-sm font-semibold"
                  >
                    저장
                  </button>
                </div>
              )}
              {isModalOpen && (
                <div
                  ref={modalRef}
                  className="absolute right-0 top-full mt-2 z-50"
                >
                  <SaveModal
                    imageUrl={pinData!.imageUrl}
                    pinId={pinId || ''}
                    onClose={handleModalClose}
                    setBoardName={setBoardName}
                  />
                </div>
              )}
            </div>
          </header>

          {/* 스크롤 가능한 콘텐츠 */}
          <div className="flex-grow overflow-y-auto">
            <div className="flex flex-col">
              <h1 className="text-3xl font-semibold mb-4">{pinData?.title}</h1>
              <UserTag uid={pinData?.userId || ''} />
              <p className="text-black mb-4 text-sm">{pinData?.description}</p>

              {/* 댓글 영역 */}
              <div
                className="flex flex-row justify-between items-center pr-5 cursor-pointer"
                onClick={() => setIsCommentOpen(!isCommentOpen)}
              >
                <div className="inline-block font-semibold">
                  <span>댓글</span>
                  <span className="ml-1">{comments.length}</span>
                  <span>개</span>
                </div>
                <div className="inline-block ml-[7px]">
                  <svg
                    aria-label="댓글 열기"
                    className="Uvi gUZ U9O kVc"
                    height="12"
                    role="img"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <path d="M20.16 6.65 12 14.71 3.84 6.65a2.27 2.27 0 0 0-3.18 0 2.2 2.2 0 0 0 0 3.15L12 21 23.34 9.8a2.2 2.2 0 0 0 0-3.15 2.26 2.26 0 0 0-3.18 0"></path>
                  </svg>
                </div>
              </div>
              {isCommentOpen &&
                comments.map((comment) => (
                  <ProfileComment
                    key={comment.commentId}
                    profileUrl={''}
                    userName={comment.nickname}
                    userId={comment.userId}
                    comment={comment.content}
                    onReplyClick={() => handleReplyClick(comment.commentId)}
                  />
                ))}
            </div>
          </div>

          {/* 하단 영역 */}
          <footer className="bg-white pt-2">
            {comments.length ? (
              <></>
            ) : (
              <p className="text-black font-semibold mb-4">어떠셨나요?</p>
            )}
            <form>
              <label htmlFor="comment" className="sr-only">
                댓글 입력
              </label>
              <div className="relative w-full mb-4 pr-2">
                <input
                  id="comment"
                  type="text"
                  placeholder="댓글을 추가..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // 엔터 입력 시 폼 제출 방지 (필요할 경우)
                      handleAddComment(userId || '');
                    }
                  }}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border px-[15px] py-[13px] pr-[50px] rounded-full bg-[#e9e9e9] focus:outline-none focus:ring-2 focus:ring-gray-400"
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(userId || '')}
                  disabled={!comment.trim()}
                  className={`absolute top-1/2 right-[15px] -translate-y-1/2 p-2 rounded-full font-semibold focus:outline-none focus:ring-2 ${
                    comment.trim()
                      ? 'bg-[#e60023] text-white hover:bg-red-700 focus:ring-red-400'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg
                    aria-hidden="true"
                    aria-label=""
                    height="16"
                    role="img"
                    viewBox="0 0 24 24"
                    width="16"
                    fill="currentColor"
                  >
                    <path d="m.46 2.43-.03.03c-.4.42-.58 1.06-.28 1.68L3 10.5 16 12 3 13.5.15 19.86c-.3.62-.13 1.26.27 1.67l.05.05c.4.38 1 .56 1.62.3l20.99-8.5q.28-.12.47-.3l.04-.04c.68-.71.51-2-.51-2.42L2.09 2.12Q1.79 2 1.49 2q-.61.01-1.03.43"></path>
                  </svg>
                </button>
              </div>
            </form>
          </footer>
        </section>
      </main>
    </div>
  );
};

export default PinPage;
