import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { FaPlusCircle } from 'react-icons/fa';

const defaultProfileImage =
  'https://i.pinimg.com/736x/3b/73/a1/3b73a13983f88f8b84e130bb3fb29e17.jpg';

type Story = {
  id: string;
  profileImage: string | null;
};

const StoryList = (): JSX.Element => {
  const [storyList, setStoryList] = useState<Story[]>([]);
  const [userProfile, setUserProfile] = useState<{
    id: string;
    profileImage: string;
  }>({
    id: '',
    profileImage: defaultProfileImage,
  });

  const navigate = useNavigate();
  const currentUserUid = useCurrentUserUid();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!currentUserUid) {
          console.error('현재 사용자 UID가 유효하지 않습니다.');
          return;
        }

        const userDocRef = doc(db, 'users', currentUserUid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userProfile = userDoc.data();
          setUserProfile({
            id: userProfile.id || 'unknown',
            profileImage: userProfile.profileImage || defaultProfileImage,
          });
        } else {
          console.error('사용자 데이터를 찾을 수 없습니다.');
        }
      } catch (error) {
        console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchUserProfile();
  }, [currentUserUid]);

  useEffect(() => {
    const fetchStoryList = async () => {
      const dummyStories = [
        { id: 'id1', profileImage: '' },
        { id: 'id2', profileImage: '' },
        { id: 'id3', profileImage: '' },
        { id: 'id4', profileImage: '' },
      ];
      setStoryList(dummyStories);
    };

    fetchStoryList();
  }, []);

  const handleCreateStory = () => {
    navigate('/create-story');
  };

  const handleViewStory = (storyId: string) => {
    navigate(`/story/${storyId}`);
  };

  return (
    <div className="flex gap-4">
      <div className="relative w-20 text-center">
        <div className="w-20 h-20 rounded-full overflow-hidden mb-1">
          <img
            src={userProfile.profileImage || defaultProfileImage}
            alt="현재 사용자 프로필"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute bottom-6 right-0 bg-white p-0.5 rounded-full cursor-pointer"
          onClick={handleCreateStory}
        >
          <FaPlusCircle color="#0098fe" size={20} />
        </div>
        <p>{userProfile.id}</p>
      </div>

      {storyList.map((story) => (
        <div
          key={story.id}
          className="w-20 text-center cursor-pointer"
          onClick={() => handleViewStory(story.id)}
        >
          <div className="w-20 h-20 bg-slate-200 rounded-full overflow-hidden mb-1">
            <img
              src={story.profileImage || defaultProfileImage}
              alt={`${story.id}의 프로필`}
              className="w-full h-full object-cover"
            />
          </div>
          <p>{story.id}</p>
        </div>
      ))}
    </div>
  );
};

export default StoryList;
