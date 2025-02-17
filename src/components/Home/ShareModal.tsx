// import { React } from 'react';
import React, { useState } from 'react';
import { FaLink } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';

interface ShareModalProps {
  onClose: () => void;
}
type LocalUser = {
  id: string;
  name: string;
  profileImage: string;
};

export const ShareModal: React.FC<ShareModalProps> = () => {
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
      className="bg-white p-6 rounded-xl shadow-lg w-96 absolute bottom-11 fixed z-30"
      style={{ left: '40%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}
      onClick={(e) => e.stopPropagation()}
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
      <div className="flex flex-col gap-3 max-h-60 overflow-y-auto"></div>
    </div>
  );
};
