import React from 'react';

interface ProfileCommentProps {
  profileUrl?: string; // 프로필 이미지 URL (optional)
  userName: string; // 사용자 이름
  comment: string; // 댓글 내용
  onReplyClick: () => void; // 답변 버튼 클릭 이벤트
}

const ProfileComment: React.FC<ProfileCommentProps> = ({
  profileUrl,
  userName,
  comment,
  onReplyClick,
}) => {
  // 이름의 첫 글자를 추출
  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  return (
    <div className="flex items-center space-x-2 p-2 border-gray-200 ">
      {/* 프로필 원 */}
      <div className="w-8 h-8 flex items-center justify-center bg-[#e9e9e9] text-black rounded-full text-mg font-normal">
        {profileUrl ? (
          <img
            src={profileUrl}
            alt={userName}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span>{getInitials(userName)}</span>
        )}
      </div>

      {/* 이름과 댓글 */}
      <div className="flex flex-row">
        <div className="font-semibold text-gray-800">{userName}</div>
        <p className="text-gray-600 text-base">{comment}</p>
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
