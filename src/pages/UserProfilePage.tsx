import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../components/Profile';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const UserProfile = (): JSX.Element => {
  const { userId } = useParams<{ userId: string }>(); // URL에서 userId 추출
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUid(user.uid);
      } else {
        setCurrentUserUid(null);
      }
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 정리
  }, []);

  if (currentUserUid === null) {
    return <div>Loading...</div>;
  }

  return (
    <Profile
      uid={userId!} // 프로필 주인의 UID
      currentUserUid={currentUserUid} // 로그인한 사용자의 UID
      isCurrentUser={currentUserUid === userId} // 내 프로필인지
    />
  );
};

export default UserProfile;
