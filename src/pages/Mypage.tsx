const Mypage = (): JSX.Element => {
  return (
    <div className="p-4">
      <div className="pb-4 mb-6 text-center">
        <img
          src="https://www.svgrepo.com/show/508699/landscape-placeholder.svg"
          alt="프로필 사진"
          className="w-32 h-32 object-cover rounded-full bg-gray-200 mx-auto"
        />
        <h2 className="text-2xl font-bold mt-2">이름</h2>
        <p className="text-gray-600 text-sm">아이디</p>
        <p>팔로워 1명 · 팔로잉 1명</p>
        <div className="mt-4 flex justify-center gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
            공유
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
            프로필 수정
          </button>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
