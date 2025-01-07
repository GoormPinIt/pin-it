import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../components/Profile';
import useCurrentUserUid from '../hooks/useCurrentUserUid';

const UserProfile = (): JSX.Element => {
  const { userId } = useParams<{ userId: string }>(); // URL에서 userId 추출
  const currentUserUid = useCurrentUserUid();

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
