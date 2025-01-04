import React from 'react';
import Profile from '../components/Profile';

const Mypage = (): JSX.Element => {
  // 로그인 후 uid 가져오는 로직 추가하기
  const currentUserUid = '1'; // 임시로 1번 유저
  return <Profile uid={currentUserUid} isCurrentUser={true} />;
};

export default Mypage;
