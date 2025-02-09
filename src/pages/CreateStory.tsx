import React, { useState, ChangeEvent, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { HiArrowUpCircle } from 'react-icons/hi2';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { toast } from 'react-toastify';

const CreateStory = (): JSX.Element => {
  const [imgBase64, setImgBase64] = useState<string>(''); // 파일 base64
  const [imgFile, setImgFile] = useState<File | null>(null); // 파일
  const [isUploading, setIsUploading] = useState(false); // 업로드 상태
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentUserUid = useCurrentUserUid();
  const navigate = useNavigate();

  const handleChangeFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target && typeof e.target.result === 'string') {
          setImgBase64(e.target.result);
        }
      };
      reader.readAsDataURL(file);
      setImgFile(file);
    }
  };

  const handleUpload = async () => {
    if (!imgFile || !currentUserUid) {
      toast.error('사진을 업로드하세요.');
      return;
    }

    setIsUploading(true);
    try {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `stories/${currentUserUid}/${imgFile.name}-${Date.now()}`,
      );

      const snapshot = await uploadBytes(storageRef, imgFile);
      const imageUrl = await getDownloadURL(snapshot.ref);

      const storyData = {
        createdAt: serverTimestamp(),
        imageUrl,
        userUid: currentUserUid,
      };

      const docRef = await addDoc(collection(db, 'stories'), storyData);

      await updateDoc(docRef, {
        storyId: docRef.id,
      });

      toast.success('스토리가 성공적으로 업로드되었습니다.');
      navigate('/');
    } catch (error) {
      console.error('스토리 업로드 중 오류 발생:', error);
      toast.error('스토리 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center px-6 lg:w-[721px] m-0 p-6 space-y-6 mx-auto bg-white rounded-2xl">
      <h1 className="text-3xl font-medium">스토리 올리기</h1>
      <div className="h-[450px] w-[375px] bg-[#e9e9e9] rounded-[5%] border-[2px] border-gray-300 border-dashed relative overflow-hidden">
        {!imgBase64 ? (
          <label className="absolute inset-0 flex flex-col justify-center items-center cursor-pointer text-gray-600 gap-4">
            <HiArrowUpCircle className="text-[40px] text-black" />
            <h2 className="font-normal text-black max-w-[240px] text-center">
              스토리에 업로드할 파일을 선택하거나 여기로 끌어다 놓으세요.
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
              Pinterest는 20 MB 미만의 고화질 .jpg 파일 또는 200 MB 미만의 .mp4
              파일 사용을 권장합니다.
            </div>
          </label>
        ) : (
          <div className="relative w-full h-full">
            <img
              src={imgBase64}
              alt="미리 보기"
              className="absolute inset-0 w-full h-full object-cover"
            />

            <button
              className="absolute top-3 right-3 w-10 h-10 bg-gray-200 text-white text-sm px-3 py-1 rounded-full hover:bg-gray-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg
                aria-hidden="true"
                aria-label=""
                className="Uvi gUZ U9O kVc"
                height="18"
                role="img"
                viewBox="0 0 24 24"
                width="18"
              >
                <path d="M17.45 1.95a3.25 3.25 0 1 1 4.6 4.6l-2.3 2.3-4.6-4.6zM2.5 16.9 13.4 6.02l4.6 4.6L7.08 21.5 1 23z"></path>
              </svg>
            </button>
            <input
              ref={fileInputRef}
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleChangeFile}
            />
          </div>
        )}
      </div>

      <button
        className="mt-4 bg-btn_red text-white px-6 py-2 rounded-full hover:bg-btn_h_red"
        onClick={handleUpload}
        disabled={isUploading}
      >
        {isUploading ? '업로드 중...' : '스토리 업로드'}
      </button>
    </div>
  );
};

export default CreateStory;
