import { FaRegHeart } from 'react-icons/fa';
import { RiShare2Line } from 'react-icons/ri';
import { HiDotsHorizontal } from 'react-icons/hi';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase';
import { v4 as uuidv4 } from 'uuid';
import { addCommentToFirestore } from '../utils/firestoreUtils';

// import { FaSmile } from 'react-icons/fa';
// import { LuSticker } from 'react-icons/lu';
// import { AiOutlinePicture } from 'react-icons/ai';
import SaveDropdown from '../components/SaveDropdown';
import ProfileComment from '../components/ProfileComment';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  doc,
  getDoc,
  getDocs,
  where,
  query,
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
  creatorId: string;
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

  const handleModalOpen = () => {
    setIsModalOpen(true); // 모달 열기
  };

  useEffect(() => {
    setBoardName('보드 이름');
  }, []);

  const handleModalClose = () => {
    setIsModalOpen(false); // 모달 닫기
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

  const handleAddComment = () => {
    if (!comment.trim()) return; // 빈 문자열은 무시

    const newComment = {
      commentId: uuidv4(),
      content: comment,
      nickname: 'test7',
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
  };

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
              className="w-full h-full object-cover"
            />
          </figure>
        </section>

        {/* 우측 콘텐츠 섹션 */}
        <section className="w-1/2 pl-3 h-full flex flex-col justify-between">
          <div className="overflow-y-auto pb-10">
            <div className="flex items-center justify-between mb-4 pt-5 pr-5">
              <div className="flex items-center space-x-4 text-gray-600">
                <FaRegHeart />
                <span className="text-black"></span>
                <RiShare2Line />
                <HiDotsHorizontal />
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className="flex items-center bg-white hover:bg-[#e2e2e2] px-4 py-2 rounded-full "
                  onClick={handleModalOpen}
                >
                  <button className="text-black text-sm font-semibold">
                    {boardName}
                  </button>
                  <svg
                    aria-label="댓글 열기"
                    className="ml-2"
                    height="12"
                    role="img"
                    viewBox="0 0 24 24"
                    width="12"
                  >
                    <path d="M20.16 6.65 12 14.71 3.84 6.65a2.27 2.27 0 0 0-3.18 0 2.2 2.2 0 0 0 0 3.15L12 21 23.34 9.8a2.2 2.2 0 0 0 0-3.15 2.26 2.26 0 0 0-3.18 0"></path>
                  </svg>
                </div>
                <button className="bg-[#e60023] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  저장
                </button>
              </div>
              {/* SaveModal 컴포넌트 */}
              {isModalOpen && (
                <div ref={modalRef}>
                  <SaveDropdown
                    pinId={pinId || ''}
                    onClose={handleModalClose} // 모달 닫기 핸들러 전달
                  />
                </div>
              )}
            </div>

            {/* 제목 */}
            <h1 className="text-3xl font-semibold mb-4">{pinData?.title}</h1>

            {/* 사용자 */}
            {/* <header className="flex items-center mb-4">
              <figure className="w-8 h-8 rounded-full overflow-hidden mr-2">
                <img
                  src="https://eu.ui-avatars.com/api/?name=John+Doe&size=250"
                  alt="사용자 프로필"
                />
              </figure>
              <span className="font-normal">vicky 🐧</span>
            </header> */}
            <UserTag uid={pinData?.creatorId || ''} />

            {/* 글 */}
            <p className="text-black mb-4">{pinData?.description}</p>
            {/* <p className="text-blue-500 mb-4">
              <a href="#tag" className="hover:underline">
                #miffy
              </a>
            </p> */}

            <div
              className="flex flex-row justify-between items-center pr-5 cursor-pointer"
              onClick={() => {
                setIsCommentOpen(!isCommentOpen);
              }}
            >
              <div className="inline-block font-semibold ">
                <span className="inline-block">댓글</span>
                <span className="inline-block ml-1">{comments.length}</span>
                <span className="inline-block">개</span>
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
            <div>
              {isCommentOpen &&
                comments.map((comment) => (
                  <ProfileComment
                    key={comment.commentId}
                    profileUrl={''} // 프로필 URL이 없는 경우
                    userName={comment.nickname}
                    comment={comment.content}
                    onReplyClick={() => handleReplyClick(comment.commentId)}
                  />
                ))}
            </div>
            <article className="chat"></article>
          </div>

          {/* 하단 영역 */}
          <div className="mt-auto">
            {/* 설명 */}
            <p className="text-black font-semibold mb-4">어떠셨나요?</p>

            {/* 댓글 입력란 */}
            <footer className="sticky bottom-0 bg-white pt-2">
              <form>
                <label htmlFor="comment" className="sr-only">
                  댓글 입력
                </label>
                <div className="relative w-full mb-4 pr-2">
                  <input
                    id="comment"
                    type="text"
                    placeholder="댓글을 추가..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border px-[15px] py-[13px] pr-[50px] rounded-full bg-[#e9e9e9] focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddComment}
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default PinPage;
