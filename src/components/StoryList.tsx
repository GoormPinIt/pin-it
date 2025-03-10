import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  getDocs,
  orderBy,
  where,
  doc,
  getDoc,
  deleteDoc,
  Timestamp,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { FaPlusCircle } from 'react-icons/fa';

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
  const [hasStory, setHasStory] = useState(false);

  const navigate = useNavigate();
  const currentUserUid = useCurrentUserUid();

  const deleteOldStories = async () => {
    try {
      const now = new Date();
      const twentyFourHoursAgo = Timestamp.fromDate(
        new Date(now.getTime() - 24 * 60 * 60 * 1000),
      );

      const oldStoriesQuery = query(
        collection(db, 'stories'),
        where('createdAt', '<=', twentyFourHoursAgo),
      );

      const querySnapshot = await getDocs(oldStoriesQuery);

      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref),
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error('24시간이 지난 스토리를 삭제하는 중 오류 발생:', error);
    }
  };

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

        const userStoriesQuery = query(
          collection(db, 'stories'),
          where('userUid', '==', currentUserUid),
          orderBy('createdAt', 'asc'),
          limit(1),
        );
        const querySnapshot = await getDocs(userStoriesQuery);
        setHasStory(!querySnapshot.empty);
      } catch (error) {
        console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchUserProfile();
  }, [currentUserUid]);

  useEffect(() => {
    const fetchStoryList = async () => {
      await deleteOldStories();

      if (!currentUserUid) return;

      try {
        const currentUserDocRef = doc(db, 'users', currentUserUid);
        const currentUserDoc = await getDoc(currentUserDocRef);

        if (!currentUserDoc.exists()) {
          console.error('현재 사용자 데이터를 찾을 수 없습니다.');
          return;
        }

        const followingList: string[] = currentUserDoc.data().following || [];

        if (followingList.length === 0) {
          console.log('팔로잉하는 유저가 없습니다.');
          setStoryList([]);
          return;
        }

        const storiesQuery = query(
          collection(db, 'stories'),
          where('userUid', 'in', followingList),
          orderBy('createdAt', 'asc'),
        );
        const querySnapshot = await getDocs(storiesQuery);

        const userStoryMap = new Map<string, Story>();

        await Promise.all(
          querySnapshot.docs.map(async (storyDoc) => {
            const storyData = storyDoc.data();
            const userDocRef = doc(db, 'users', storyData.userUid);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
              const userData = userDoc.data() as {
                id: string;
                profileImage?: string;
              };
              const story: Story = {
                storyId: storyDoc.id,
                userUid: storyData.userUid,
                userId: userData.id || 'unknown',
                profileImage: userData.profileImage || defaultProfileImage,
                createdAt: storyData.createdAt || '',
              };

              if (!userStoryMap.has(storyData.userUid)) {
                userStoryMap.set(storyData.userUid, story);
              }
            }
          }),
        );

        setStoryList(Array.from(userStoryMap.values()));
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
        <div
          className={`w-20 h-20 rounded-full overflow-hidden mb-1 border-4 ${
            hasStory ? 'border-[#0098fe]' : 'border-transparent'
          }`}
        >
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
