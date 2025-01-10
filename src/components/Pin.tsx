import React, { useState, useEffect } from 'react';
import Button from './Button';
import { IoIosMore } from 'react-icons/io';
import { RiShare2Line } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { FaLink } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { savePinToBoard, fetchBoards } from '../features/boardSlice';

interface PinProps {
  src: string;
  id: string;
}
interface OptionsModalProps {
  src: string;
  id: string;
}
type LocalUser = {
  id: string;
  name: string;
  profileImage: string;
};
const ShareModal = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<LocalUser[]>([]);
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;
  const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;
  // const handleSend = (id: string) => {
  //   alert(`${id}에게 내 프로필을 보냈습니다.`);
  //   // 메시지로 내 프로필 보내는 로직 추가하기
  // };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      })
      .catch((err) => {
        console.error('링크 복사 실패:', err);
      });
  };

  const handleTwitterShare = () => {
    const text = 'Pinterest에서 꼭 팔로우해야 할 사람을 찾았습니다.';

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text,
    )}&url=${encodeURIComponent(currentUrl)}&via=pinterest`;

    window.open(twitterUrl, 'twitter-share-dialog', 'width=600,height=400');
  };

  const handleFacebookShare = () => {
    const currentUrl = 'https://example.com'; // Open Graph 태그가 있는 URL 이어야 공유 시 링크가 뜸. 현재 로컬호스트는 링크가 안떠서 임시 URL

    const facebookUrl = `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&href=${encodeURIComponent(
      currentUrl,
    )}&display=popup`;

    window.open(facebookUrl, 'facebook-share-dialog', 'width=600,height=400');
  };

  const handleMessengerShare = () => {
    const currentUrl = 'https://example.com'; // Open Graph 태그가 있는 URL 이어야 공유 시 링크가 뜸. 현재 로컬호스트는 링크가 안떠서 임시 URL

    const messengerUrl = `fb-messenger://share?link=${encodeURIComponent(
      currentUrl,
    )}&app_id=${facebookAppId}`;

    const browserMessengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
      currentUrl,
    )}&app_id=${facebookAppId}&redirect_uri=${encodeURIComponent(currentUrl)}`;

    if (navigator.userAgent.match(/FBAN|FBAV/i)) {
      // Messenger 앱이 설치된 경우 실행
      window.open(messengerUrl, '_blank');
    } else {
      // 일반 웹 브라우저 환경
      window.open(
        browserMessengerUrl,
        'messenger-share-dialog',
        'width=600,height=400',
      );
    }
  };

  return (
    <div
      className="bg-white p-6 rounded-xl shadow-lg w-96 absolute bottom-11 z-30"
      style={{ left: '40%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}
    >
      <p className="mb-4 text-center">공유</p>
      <div className="flex justify-evenly mb-4 pb-4 border-b-2">
        <button className="flex flex-col items-center" onClick={handleCopyLink}>
          <FaLink className="w-10 h-10 mb-2 bg-gray-200 rounded-full pl-3 pr-3" />
          <span className="text-xs"> {copied ? '복사 완료' : '링크 복사'}</span>
        </button>
        <a
          href={`https://web.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center"
        >
          <img
            src="https://cdn.pixabay.com/photo/2021/12/10/16/38/whatsapp-6860919_1280.png"
            alt="WhatsApp"
            className="w-10 h-10 rounded-full mb-2"
          />
          <span className="text-xs">WhatsApp</span>
        </a>
        <button
          className="flex flex-col items-center"
          onClick={handleMessengerShare}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/2048px-Facebook_Messenger_logo_2020.svg.png"
            alt="FacebookMessenger"
            className="w-10 h-10 mb-2"
          />
          <span className="text-xs">Messenger</span>
        </button>
        <button
          className="flex flex-col items-center"
          onClick={handleFacebookShare}
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1280px-Facebook_f_logo_%282019%29.svg.png"
            alt="Facebook"
            className="w-10 h-10 mb-2"
          />
          <span className="text-xs">Facebook</span>
        </button>

        <button
          className="flex flex-col items-center"
          onClick={handleTwitterShare}
        >
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo9rzArm7GEm9dZBAFHhS_BSPvuBiuPnXwcg&s"
            alt="Twitter"
            className="w-10 h-10 mb-2"
          />
          <span className="text-xs">X</span>
        </button>
      </div>
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/4 text-gray-500" />
        <input
          id="searchUser"
          type="text"
          placeholder="이름 또는 이메일 검색"
          className="w-full p-2 pl-10 border-2 border-gray-300 rounded-full mb-4"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
        {/* {filteredUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-2">
            <div className="flex items-center gap-3">
              <img
                src={user.profileImage || defaultProfileImage}
                alt="profile"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-gray-500 text-sm">@{user.id}</p>
              </div>
            </div>
            <button
              onClick={() => handleSend(user.id)}
              className="px-4 py-2 bg-btn_gray rounded-full hover:bg-btn_h_gray"
            >
              보내기
            </button>
          </div>
        ))} */}
      </div>
    </div>
  );
};
// console.log('boards in Pin:', boards);
const OptionsModal: React.FC<OptionsModalProps> = ({ src, id }) => {
  const handleSaveImage = async () => {
    try {
      // Firebase Storage 참조 생성
      const storage = getStorage();
      const imageRef = ref(storage, src);

      // 다운로드 URL 가져오기
      const downloadURL = await getDownloadURL(imageRef);

      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = downloadURL;
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
  return (
    <div
      className="bg-white p-2 pt-4 rounded-xl shadow-lg w-80 absolute top-11 z-30 text-black"
      style={{ left: '40%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}
    >
      <p className="mb-4 text-center text-sm font-light">
        회원님의 최근 활동을 바탕으로 추천된 핀입니다.
      </p>
      <div className="text-left p-2 hover:bg-black/15 rounded-2xl">
        핀 숨기기
      </div>
      <div
        className="text-left p-2 hover:bg-black/15 rounded-2xl"
        onClick={handleSaveImage}
      >
        이미지 다운로드
      </div>
      <div className="text-left p-2 hover:bg-black/15 rounded-2xl">핀 신고</div>
    </div>
  );
};

const Pin: React.FC<PinProps> = ({ id, src }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { boards, userId } = useSelector((state: RootState) => state.boards);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  // const [showBoardsList, setShowBoardsList] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  // 컴포넌트 마운트 시 보드 목록 가져오기
  useEffect(() => {
    if (userId) {
      console.log('Fetching boards for userId:', userId);
      dispatch(fetchBoards(userId));
    }
  }, [userId]);

  // boards 상태 변경 확인을 위한 useEffect
  // useEffect(() => {
  //   console.log('Current boards:', boards);
  // }, [boards]);

  // const handleSaveClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   console.log('저장');
  //   setShowBoardsList((prev) => !prev);
  // };
  // const handleSaveToBoard = async (boardId: string, boardName: string) => {
  //   try {
  //     console.log('보드 선택 됨', boardName);
  //     await dispatch(savePinToBoard({ boardId, pinId: id })).unwrap();
  //     alert(`${boardName}에 저장 완료`);
  //     setShowBoardsList(false);
  //   } catch (error) {
  //     console.error('핀 저장 실패:', error);
  //     alert('Error: 핀 저장 실패');
  //   }
  // };
  const handleQuickSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Available boards:', boards); // 현재 boards 상태 확인
    if (boards.length === 0) {
      alert('저장할 보드가 없습니다.');
      return;
    }
    // 랜덤으로 보드 선택
    const randomBoard = boards[Math.floor(Math.random() * boards.length)];
    setSelectedBoard(randomBoard);

    try {
      await dispatch(
        savePinToBoard({ boardId: randomBoard.id, pinId: id }),
      ).unwrap();
      alert(`"${randomBoard.title}"에 저장되었습니다.`);
      setIsSaved((prev) => !prev);
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
    e.preventDefault();
    setIsShareModalOpen((prev) => !prev);
    setIsOptionsModalOpen(false);
  };

  const handleOptionsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOptionsModalOpen((prev) => !prev);
    setIsShareModalOpen(false);
  };

  return (
    <div className="relative hover:bg-blend-darken">
      <Link to={`/pin/${id}`} className="relative">
        <img src={src} className="w-full object-cover rounded-3xl" />
        <div className="z-10 absolute inset-0 hover:bg-black hover:bg-opacity-50 w-full rounded-3xl opacity-0 hover:opacity-100">
          <button className="absolute top-3 rounded-2xl left-3 text-white block py-2 px-3 hover:bg-black/30 font-medium bg-transparent outline-none">
            {selectedBoard ? selectedBoard.title : '...'}
          </button>
          <Button
            className="absolute top-3 right-3 px-5 py-3 z-20 pointer-events-auto"
            onClick={handleQuickSave}
          >
            저장
          </Button>
          <div className="absolute bottom-3 w-full flex justify-end gap-1 right-3 ">
            <Button
              className="bg-slate-200 hover:bg-slate-300 rounded-full p-3 z-10 pointer-events-auto"
              onClick={handleShareClick}
            >
              <RiShare2Line className="text-neutral-900 font-black text-sm " />
            </Button>
            {isShareModalOpen && <ShareModal />}
            <Button
              className="bg-slate-200 hover:bg-slate-300 rounded-full text-sm p-3 z-10 pointer-events-auto"
              onClick={handleOptionsClick}
            >
              {isOptionsModalOpen && <OptionsModal src={src} id={id} />}
              <IoIosMore className="text-neutral-900" />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default Pin;
