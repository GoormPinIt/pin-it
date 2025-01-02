import React from 'react';
import { useParams } from 'react-router-dom';
import Profile from '../components/Profile';

const UserProfile = (): JSX.Element => {
  const { userId } = useParams<{ userId: string }>(); // URL에서 userId 추출

  // 로그인 후 uid 가져오는 로직 추가하기
  const currentUserUid = '1'; // 임시로 1번 유저

  return (
    <Profile
      uid={userId!}
      isCurrentUser={currentUserUid === userId} // 내 프로필인지
    />
  );
};

export default UserProfile;
