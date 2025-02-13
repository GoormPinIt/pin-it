import React, { useEffect } from 'react';
import useFetchUserData from '../hooks/useFetchUserData';
import { useNavigate } from 'react-router-dom';

interface ProfileProps {
  uid: string;
}

const UserTag: React.FC<ProfileProps> = ({ uid }) => {
  const { user, loading, error } = useFetchUserData(uid);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(uid);
  }, []);

  const handleClick = () => {
    if (uid) {
      console.log('uid:', uid);
      navigate(`/profile/${uid}`); // uid를 포함한 경로로 이동
    }
  };

  return (
    <header
      className="flex items-center mb-2 cursor-pointer"
      onClick={handleClick}
    >
      <figure className="w-8 h-8 rounded-full overflow-hidden mr-2">
        {user?.profileImage ? (
          <img
            src={user.profileImage}
            alt="사용자 프로필"
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <img
            src="https://i.pinimg.com/736x/3b/73/a1/3b73a13983f88f8b84e130bb3fb29e17.jpg"
            alt="사용자 프로필"
          />
        )}
      </figure>
      <span className="font-normal">{user?.name}</span>
    </header>
  );
};

export default UserTag;
