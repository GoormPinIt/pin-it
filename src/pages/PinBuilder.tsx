import React, { useState, ChangeEvent, useEffect, useRef } from 'react';
// import Sidebar from '../components/Sidebar';
import InputField from '../components/InputField';
import { HiArrowUpCircle } from 'react-icons/hi2';
import useUploadImage from '../hooks/useUploadImage';
import SearchDropdown from '../components/SearchDropdown';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { addPinToFirestore } from '../utils/firestoreUtils';

interface PinData {
  pinId: string;
  title: string;
  userId: string;
  description: string;
  imageUrl: string;
  link: string;
  tag: string;
  allowComments: boolean;
  showSimilarProducts: boolean;
  creatorId: string;
  savedBy: string[]; // 핀을 저장한 유저 ID 배열
  boards: string[]; // 핀을 저장한 보드드 ID 배열
  comments: string[]; // 핀에 작성된 코멘트 배열
  createdAt: Date; // 핀 생성 날짜
}
//firebase
import {
  addDoc,
  collection,
  updateDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db } from '../firebase';
// import { v4 as uuidv4 } from 'uuid';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { auth } from '../firebase';

import './PinBuilder.css';

const PinBuilder = () => {
  const { isLoggedIn, userData } = useSelector(
    (state: RootState) => state.auth,
  );

  const [imgBase64, setImgBase64] = useState<string>(''); // 파일 base64
  const [imgFile, setImgFile] = useState<File | null>(null); // 파일
  const [toastVisible, setToastVisible] = useState(false);
  const [imgUrl, setImgUrl] = useState<string>(''); // 파일
  const [uploadedfile, setUploadedfile] = useState<string>(''); // 업로드한 파일
  const [userId, setUserId] = useState<string | null>(null);
  const [title, setTitle] = useState<string>('');
  const [board, setBoard] = useState<string>('');
  const [link, setLink] = useState<string>('');
  const [allowComments, setAllowComments] = useState<boolean>(true);
  const [showSimilarProducts, setShowSimilarProducts] = useState<boolean>(true);
  const [tag, setTag] = useState<string>('');
  const [imgDes, setImgDes] = useState<string>(''); // 업로드한 파일 설명
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 열림 상태

  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const uploadImage = useUploadImage();

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case 'title':
        setTitle(value);
        break;
      case 'description':
        setImgDes(value);
        break;
      case 'link':
        setLink(value);
        break;
      case 'board':
        setBoard(value);
        break;

      case 'tag':
        setTag(value);
        break;
    }
  };

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImgBase64(e.target.result);
          setIsImageUploaded(true);
        }
      };
      reader.readAsDataURL(file);
      setImgFile(file);
    }
  };

  const handleSubmit = async () => {
    try {
      let downloadUrl = '';

      if (imgFile) {
        downloadUrl = await uploadImage(imgFile);
        console.log('다운된 이미지: ', downloadUrl);
        setImgUrl(downloadUrl);
      }

      const pinData: PinData = {
        pinId: '',
        userId: userId || '',
        title: title,
        description: imgDes || '',
        imageUrl: downloadUrl,
        link: link || '',
        tag: tag || '',
        allowComments: allowComments,
        showSimilarProducts: showSimilarProducts,
        creatorId: '1',
        savedBy: [],
        boards: [],
        comments: [],
        createdAt: new Date(),
      };

      pinData.boards.push(board);

      const docRef = await addDoc(collection(db, 'pins'), pinData);
      console.log('Document ID:', docRef.id);
      console.log('User ID:', userId);

      await updateDoc(docRef, { pinId: docRef.id });

      console.log('저장 완료');
      setToastVisible(true); // 토스트 메시지 표시

      resetForm();
    } catch (error) {
      console.error('Error handling submit:', error);
    }
  };

  const handleBoardClick = () => {
    setIsDropdownOpen(true); // 드롭다운 열기
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false); // 드롭다운 닫기
  };

  const resetForm = () => {
    setImgBase64('');
    setImgFile(null);
    setImgUrl('');
    setUploadedfile('');
    setTitle('');
    setBoard('');
    setLink('');
    setAllowComments(true);
    setShowSimilarProducts(true);
    setTag('');
    setImgDes('');
    setIsImageUploaded(false);
  };

  return (
    <div className="pin-builder-main">
      {toastVisible && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-md">
          저장되었습니다!
        </div>
      )}
      <div className="pin-builder-content">
        <div className="pin-builder-bar">
          {/* <div className="pin-builder-bar-space"></div> */}
          <h1 className="pin-builder-title">핀 만들기</h1>
          {isImageUploaded && (
            <button
              className="pin-builder-publish-button"
              onClick={handleSubmit}
            >
              게시
            </button>
          )}
        </div>
        <div className="pin-builder-inner-container">
          {/* 첫 번째 영역 */}
          <div className="pin-builder-first-area">
            {/* <div className="pin-builder-first-area-content"> */}
            <div className="bg-white rounded-2xl">
              <div className="h-[450px] w-[375px] bg-[#e9e9e9] rounded-[5%] border-[2px] border-gray-300 border-dashed relative overflow-hidden">
                {!imgBase64 ? (
                  <label className="absolute inset-0 flex flex-col justify-center items-center cursor-pointer text-gray-600 gap-4">
                    <HiArrowUpCircle className="text-[40px] text-black" />
                    <h2 className="font-normal text-black max-w-[220px] text-center">
                      파일을 선택하거나 여기로 끌어다 놓으세요.
                    </h2>
                    <input
                      ref={fileInputRef}
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleChangeFile}
                    />
                    <div className="absolute bottom-4 px-6 text-center text-gray-500 text-[12px] leading-snug">
                      Pinterest는 20 MB 미만의 고화질 .jpg 파일 또는 200 MB
                      미만의 .mp4 파일 사용을 권장합니다.
                    </div>
                  </label>
                ) : (
                  <img
                    src={imgBase64}
                    alt="미리 보기"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
              </div>
            </div>
            <hr className="pin-builder-divider" />
            <button className="pin-builder-save-button">URL에서 저장</button>
          </div>

          {/* 두 번째 영역 */}
          <div
            className={`pin-builder-second-area ${
              imgBase64 ? 'opacity-100' : 'opacity-40'
            }`}
          >
            <div className="pin-builder-second-area-content">
              <form className="pin-builder-form">
                <InputField
                  label="제목"
                  placeholder="제목 추가"
                  disabled={!isImageUploaded}
                  value={title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                <InputField
                  label="설명"
                  placeholder="자세한 설명을 추가하세요."
                  textarea
                  disabled={!isImageUploaded}
                  value={imgDes}
                  onChange={(e) =>
                    handleInputChange('description', e.target.value)
                  }
                />
                <InputField
                  label="링크"
                  placeholder="링크 추가"
                  type="url"
                  value={link}
                  disabled={!isImageUploaded}
                  onChange={(e) => handleInputChange('link', e.target.value)}
                />
                {/* <InputField
                  label="보드"
                  placeholder="보드 선택"
                  disabled={!isImageUploaded}
                  value={board}
                  onClick={handleBoardClick} // 클릭 시 드롭다운 열기
                  readOnly
                /> */}
                <div className="relative">
                  <InputField
                    label="보드"
                    placeholder="보드 선택"
                    disabled={!isImageUploaded}
                    value={board}
                    onClick={handleBoardClick} // 클릭 시 드롭다운 열기
                    readOnly
                  />
                  {isDropdownOpen && userId && (
                    <SearchDropdown
                      setBoard={setBoard}
                      closeDropdown={closeDropdown}
                      userId={userId}
                    />
                  )}
                </div>
                <InputField
                  label="태그된 주제 (0)개"
                  placeholder="태그 검색"
                  disabled={!isImageUploaded}
                  onChange={(e) => handleInputChange('tag', e.target.value)}
                  value={tag}
                />
                <p className="pin-builder-note">
                  걱정하지 마세요. 사람들에게 태그는 보여지지 않습니다.
                </p>
                <div className="pin-builder-options">
                  <div className="pin-builder-options-label">추가 옵션</div>
                  <div className="pin-builder-options-icon">
                    <svg
                      aria-label="보드 닫기"
                      height="12"
                      role="img"
                      viewBox="0 0 24 24"
                      width="12"
                    >
                      <path d="M20.16 6.65 12 14.71 3.84 6.65a2.27 2.27 0 0 0-3.18 0 2.2 2.2 0 0 0 0 3.15L12 21 23.34 9.8a2.2 2.2 0 0 0 0-3.15 2.26 2.26 0 0 0-3.18 0"></path>
                    </svg>
                  </div>
                </div>
                <p className="pin-builder-warning">
                  불법 촬영 콘텐츠 등을 게시하는 경우 Pinterest는 한국
                  전기통신사업법 제22-5(1)조에 따라 해당 콘텐츠의 액세스를
                  삭제하거나 차단할 수 있으며, 사용자는 관련 법률 및 규정에 따라
                  처벌을 받을 수 있습니다.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PinBuilder;
