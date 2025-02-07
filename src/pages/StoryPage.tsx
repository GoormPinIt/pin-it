import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { db } from '../firebase';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { FaArrowLeft, FaArrowRight, FaTrash } from 'react-icons/fa';
import loadingCircle from '../assets/loading.gif';

const defaultProfileImage =
  'https://i.pinimg.com/736x/3b/73/a1/3b73a13983f88f8b84e130bb3fb29e17.jpg';

type Story = {
  storyId: string;
  imageUrl: string;
  createdAt: string;
  userUid: string;
};

type User = {
  id: string;
  profileImage: string;
};

const formatRelativeTime = (timestamp: any): string => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
};

const StoryPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { userUid } = useParams<{ userUid: string }>();
  const [stories, setStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [user, setUser] = useState<User>({
    id: 'unknown',
    profileImage: defaultProfileImage,
  });
  const [loading, setLoading] = useState(true);
  const currentUserUid = useCurrentUserUid();

  useEffect(() => {
    const fetchUserAndStories = async () => {
      try {
        if (!userUid) {
          return;
        }

        const userDocRef = collection(db, 'users');
        const userQuery = query(userDocRef, where('uid', '==', userUid));
        const userSnapshot = await getDocs(userQuery);

        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          setUser({
            id: userData.id || 'unknown',
            profileImage: userData.profileImage || defaultProfileImage,
          });
        }

        const storiesQuery = query(
          collection(db, 'stories'),
          where('userUid', '==', userUid),
          orderBy('createdAt', 'asc'),
        );
        const storiesSnapshot = await getDocs(storiesQuery);

        const fetchedStories = storiesSnapshot.docs.map((doc) => ({
          storyId: doc.id,
          imageUrl: doc.data().imageUrl,
          createdAt: doc.data().createdAt,
          userUid: doc.data().userUid,
        }));

        setStories(fetchedStories);
      } catch (error) {
        console.error(
          '스토리 데이터 및 유저 데이터를 가져오는 중 오류 발생:',
          error,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStories();
  }, [userUid]);

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex((prev) => prev + 1);
    }
  };

  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex((prev) => prev - 1);
    }
  };

  const deleteStory = async () => {
    if (!currentStory) return;

    const confirmDelete = window.confirm('이 스토리를 삭제하시겠습니까?');
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, 'stories', currentStory.storyId));
      const updatedStories = stories.filter(
        (story) => story.storyId !== currentStory.storyId,
      );

      if (updatedStories.length === 0) {
        navigate('/');
      } else {
        setStories(updatedStories);
        setCurrentStoryIndex((prev) => Math.max(prev - 1, 0));
      }
    } catch (error) {
      console.error('스토리 삭제 중 오류 발생:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={loadingCircle} alt="로딩 중..." className="w-12" />
      </div>
    );
  }

  const currentStory = stories[currentStoryIndex];

  return (
    <div className="flex flex-col items-center w-[800px] h-[700px] mx-auto mt-4">
      <div className="flex items-center justify-between w-full">
        <div
          className="flex items-center gap-4 mb-4 cursor-pointer"
          onClick={async () => {
            try {
              const userQuery = query(
                collection(db, 'users'),
                where('id', '==', user.id),
              );
              const userSnapshot = await getDocs(userQuery);

              if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userUid = userDoc.id;

                navigate(`/profile/${userUid}`);
              } else {
                console.error('해당 ID를 가진 사용자를 찾을 수 없습니다.');
              }
            } catch (error) {
              console.error('유저 UID를 가져오는 중 오류 발생:', error);
            }
          }}
        >
          <img
            src={user.profileImage}
            alt={`${user.id}의 프로필`}
            className="w-16 h-16 rounded-full"
          />
          <p className="text-lg font-semibold">{user.id}</p>
        </div>
        <p>{formatRelativeTime(currentStory.createdAt)}</p>
      </div>

      <div className="relative w-full bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={currentStory.imageUrl}
          alt={`스토리 ${currentStory.storyId}`}
          className="w-full h-full object-cover"
        />

        {currentStoryIndex > 0 && (
          <button
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-3xl text-white bg-slate-400 bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
            onClick={handlePreviousStory}
          >
            <FaArrowLeft />
          </button>
        )}
        {currentStoryIndex < stories.length - 1 && (
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-3xl text-white bg-slate-400 bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
            onClick={handleNextStory}
          >
            <FaArrowRight />
          </button>
        )}
        {currentStory.userUid === currentUserUid && (
          <button
            className="absolute top-4 right-4 text-xl bg-zinc-200 bg-opacity-70 p-2 rounded-full hover:bg-zinc-700 hover:text-white"
            onClick={deleteStory}
          >
            <FaTrash />
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryPage;
