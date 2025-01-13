import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProfileCommentProps {
  profileUrl?: string; // 프로필 이미지 URL (optional)
  userName: string; // 사용자 이름
  comment: string; // 댓글 내용
  userId: string; // 댓글 작성자자
  onReplyClick: () => void; // 답변 버튼 클릭 이벤트
}

const ProfileComment: React.FC<ProfileCommentProps> = ({
  profileUrl,
  userName,
  comment,
  userId,
  onReplyClick,
}) => {
  const navigate = useNavigate();
  // 이름의 첫 글자를 추출
  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  const handleUserClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate(`/profile/${userId}`); // 클릭 시 해당 유저의 페이지로 이동
  };

  return (
    <div className="flex items-center space-x-2 p-2 border-gray-200 ">
      {/* 프로필 원 */}
      <a
        onClick={handleUserClick}
        className="w-8 h-8 flex items-center justify-center bg-[#e9e9e9] text-black rounded-full text-mg font-normal cursor-pointer"
      >
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={userName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{getInitials(userName)}</span>
        )}
      </a>

      {/* 이름과 댓글 */}
      <div className="flex flex-row">
        <a
          href={`/profile/${userName}`}
          onClick={handleUserClick}
          className="font-semibold text-gray-800 hover:underline"
        >
          {userName}
        </a>
        <p className="text-gray-600 text-base inline-block max-w-full ml-2">
          {comment}
        </p>
      </div>

      {/* 답변 버튼 */}
      {/* <button
        onClick={onReplyClick}
        className="text-gray-700 hover:underline font-medium"
      >
        답변
      </button> */}
    </div>
  );
};

export default ProfileComment;
