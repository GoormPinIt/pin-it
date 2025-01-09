import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { FaPlusCircle } from 'react-icons/fa';
import { limit } from 'firebase/firestore';

const defaultProfileImage =
  'https://i.pinimg.com/736x/3b/73/a1/3b73a13983f88f8b84e130bb3fb29e17.jpg';

type Story = {
  storyId: string;
  userUid: string;
  userId: string;
  profileImage: string;
  createdAt: string;
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
      if (!currentUserUid) {
        return <div>사용자 정보를 불러오는 중...</div>;
      }

      try {
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
      try {
        const storiesQuery = query(
          collection(db, 'stories'),
          orderBy('createdAt', 'asc'),
        );
        const querySnapshot = await getDocs(storiesQuery);

        const fetchedStories = await Promise.all(
          querySnapshot.docs.map(async (storyDoc) => {
            const storyData = storyDoc.data();
            const userDocRef = doc(db, 'users', storyData.userUid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data() as {
                id: string;
                profileImage?: string;
              };
              return {
                storyId: storyDoc.id,
                userUid: storyData.userUid,
                userId: userData.id || 'unknown',
                profileImage: userData.profileImage || defaultProfileImage,
                createdAt: storyData.createdAt || '',
              };
            } else {
              console.warn(
                `사용자 데이터를 찾을 수 없습니다: ${storyData.userUid}`,
              );
              return null;
            }
          }),
        );

        setStoryList(
          fetchedStories.filter(
            (story): story is Story =>
              story !== null && story.userUid !== currentUserUid,
          ),
        );
      } catch (error) {
        console.error('스토리 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchStoryList();
  }, [currentUserUid]);

  const handleCreateStory = () => {
    navigate('/create-story');
  };

  const handleViewStory = (storyId: string, userUid: string) => {
    navigate(`/story/${userUid}/${storyId}`);
  };

  const handleProfileClick = async () => {
    try {
      const userStoriesQuery = query(
        collection(db, 'stories'),
        where('userUid', '==', currentUserUid),
        orderBy('createdAt', 'asc'),
        limit(1),
      );
      const querySnapshot = await getDocs(userStoriesQuery);

      if (!querySnapshot.empty) {
        const earliestStory = querySnapshot.docs[0];
        navigate(`/story/${currentUserUid}/${earliestStory.id}`);
      } else {
        navigate('/create-story');
      }
    } catch (error) {
      console.error('스토리 데이터를 확인하는 중 오류 발생:', error);
    }
  };

  return (
    <div className="flex gap-4">
      <div
        className="relative w-20 text-center cursor-pointer"
        onClick={handleProfileClick}
      >
        <div className="w-20 h-20 rounded-full overflow-hidden mb-1">
          <img
            src={userProfile.profileImage || defaultProfileImage}
            alt="현재 사용자 프로필"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute bottom-6 right-0 bg-white p-0.5 rounded-full cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            handleCreateStory();
          }}
        >
          <FaPlusCircle color="#0098fe" size={20} />
        </div>
        <p>{userProfile.id}</p>
      </div>

      {storyList.map((story) => (
        <div
          key={story.storyId}
          className="w-20 text-center cursor-pointer"
          onClick={() => handleViewStory(story.storyId, story.userUid)}
        >
          <div className="w-20 h-20 bg-slate-200 rounded-full overflow-hidden mb-1">
            <img
              src={story.profileImage || defaultProfileImage}
              alt={`${story.userId}의 프로필`}
              className="w-full h-full object-cover"
            />
          </div>
          <p>{story.userId}</p>
        </div>
      ))}
    </div>
  );
};

export default StoryList;
