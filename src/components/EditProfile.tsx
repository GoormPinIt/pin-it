import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import useUploadImage from '../hooks/useUploadImage';
import { toast } from 'react-toastify';

const EditProfile = (): JSX.Element => {
  const currentUserUid = useCurrentUserUid();
  const uploadImage = useUploadImage();

  const defaultImage =
    'https://i.pinimg.com/736x/3b/73/a1/3b73a13983f88f8b84e130bb3fb29e17.jpg';

  const initialProfile = {
    name: '',
    description: '',
    id: '',
    profileImage: defaultImage,
  };

  const [profile, setProfile] = useState(initialProfile);
  const [originalProfile, setOriginalProfile] = useState(initialProfile);
  const [isUploading, setIsUploading] = useState(false);
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!currentUserUid) return;

      try {
        const userDoc = doc(db, 'users', currentUserUid);
        const docSnap = await getDoc(userDoc);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          const loadedProfile = {
            name: userData.name || '',
            description: userData.description || '',
            id: userData.id || '',
            profileImage: userData.profileImage || defaultImage,
          };
          setProfile(loadedProfile);
          setOriginalProfile(loadedProfile);
        } else {
          console.log('사용자 문서를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('프로필 데이터를 불러오는 중 오류 발생:', error);
      }
    };

    fetchProfile();
  }, [currentUserUid]);

  useEffect(() => {
    const isProfileChanged =
      profile.name !== originalProfile.name ||
      profile.description !== originalProfile.description ||
      profile.id !== originalProfile.id ||
      profile.profileImage !== originalProfile.profileImage;

    setIsChanged(isProfileChanged);
  }, [profile, originalProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsUploading(true);

      try {
        const downloadURL = await uploadImage(file);

        // 업로드된 URL을 미리보기로 설정
        setProfile((prevProfile) => ({
          ...prevProfile,
          profileImage: downloadURL,
        }));

        toast.success('프로필 이미지가 성공적으로 업로드되었습니다!');

      } catch (error) {
        toast.error('이미지 업로드 중 오류가 발생했습니다:');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleReset = () => {
    setProfile(originalProfile); // 초기값으로 재설정
  };

  const handleSave = async () => {
    if (!currentUserUid) {
      return;
    }

    try {
      const userDoc = doc(db, 'users', currentUserUid);
      await updateDoc(userDoc, {
        name: profile.name,
        description: profile.description,
        id: profile.id,
        profileImage: profile.profileImage,
      });
      toast.success('프로필이 성공적으로 저장되었습니다!');
      setOriginalProfile(profile);
    } catch (error) {
      toast.error('프로필 저장 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{ width: '488px' }}>
      <p className="text-3xl font-semibold mb-2">프로필 수정</p>
      <p className="mb-6">
        개인 정보는 비공개로 유지하세요. 여기에 추가한 정보는 회원님의 프로필을
        볼 수 있는 모든 사람에게 표시됩니다.
      </p>
      <div className="space-y-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-700 mb-1">사진</label>
          <div className="flex items-center gap-4 mb-6">
            <img
              className="w-20 h-20 flex items-center justify-center bg-gray-200 rounded-full text-2xl font-semibold object-cover"
              src={profile.profileImage}
              alt="프로필"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="px-4 py-2 rounded-full bg-btn_gray hover:bg-btn_h_gray cursor-pointer"
            >
              변경
            </label>
            {isUploading && (
              <span className="text-sm text-gray-500">업로드 중...</span>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm text-gray-700 mb-1">닉네임</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="이름"
              className="w-full p-2 border-2 border-gray-300 rounded-xl"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">소개</label>
          <textarea
            name="description"
            value={profile.description}
            onChange={handleChange}
            rows={3}
            placeholder="회원님의 이야기를 들려주세요"
            className="w-full p-2 border-2 border-gray-300 rounded-xl"
          ></textarea>
        </div>

        <div>
          <label className="block text-sm text-gray-700 mb-1">아이디</label>
          <input
            type="text"
            name="id"
            value={profile.id}
            onChange={handleChange}
            placeholder="사용자 이름"
            className="w-full p-2 border-2 border-gray-300 rounded-xl"
          />
          <p className="text-xs text-gray-500 mt-1">
            www.pinterest.com/{profile.id}
          </p>
        </div>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          className="px-4 py-2 font-medium rounded-full hover:bg-btn_h_gray bg-btn_gray disabled:bg-gray-300 disabled:cursor-not-allowed disabled:text-white"
          onClick={handleReset}
          disabled={!isChanged}
        >
          재설정
        </button>
        <button
          className="px-4 py-2 font-medium text-white rounded-full hover:bg-btn_h_red bg-btn_red disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={handleSave}
          disabled={!isChanged}
        >
          저장
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
