import React from 'react';
import useFetchUserData from '../hooks/useFetchUserData';

interface ProfileProps {
  uid: string;
}

const UserTag: React.FC<ProfileProps> = ({ uid }) => {
  const { user, loading, error } = useFetchUserData(uid);
  return (
    <header className="flex items-center mb-4">
      <figure className="w-8 h-8 rounded-full overflow-hidden mr-2">
        {user?.profileImage ? (
          <img src={user.profileImage} alt="사용자 프로필" />
        ) : (
          <img
            src="https://eu.ui-avatars.com/api/?name=John+Doe&size=250"
            alt="사용자 프로필"
          />
        )}
      </figure>
      <span className="font-normal">{user?.name}</span>
    </header>
  );
};

export default UserTag;
