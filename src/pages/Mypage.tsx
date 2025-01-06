import React, { useEffect, useState } from 'react';
import Profile from '../components/Profile';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Mypage = (): JSX.Element => {
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
      uid={currentUserUid}
      currentUserUid={currentUserUid}
      isCurrentUser={true}
    />
  );
};

export default Mypage;
