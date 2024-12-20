import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import GridBoard from '../components/GridBoard';
import MasonryLayout from '../components/MasonryLayout';
import {
  doc,
  getDoc,
  getDocs,
  DocumentData,
  updateDoc,
  arrayRemove,
  arrayUnion,
  query,
  where,
  collection,
} from 'firebase/firestore';
import { db } from '../firebase';

type BoardData = {
  id: string;
  title: string;
  pinCount: number;
  updatedTime: string;
  images: string[];
};

type BoardProps = BoardData & {
  onBoardClick: (id: string) => void;
};

// 더미 보드 데이터
const boardData: BoardData[] = [
  {
    id: 'all-pins',
    title: '모든 핀',
    pinCount: 20,
    updatedTime: '1시간',
    images: [
      'https://i.pinimg.com/736x/54/3e/06/543e063d80e1d601886d60af8a09b968.jpg',
      'https://i.pinimg.com/736x/7c/fd/c1/7cfdc13a222c1502dc1a66e6cb7438d1.jpg',
      'https://i.pinimg.com/736x/09/47/1b/09471b72c946fc47908b9f3bb85b1f64.jpg',
      'https://i.pinimg.com/736x/6e/f4/1a/6ef41a60399d8fc42419559e843d933e.jpg',
      'https://i.pinimg.com/736x/03/32/6d/03326de049c83e53656769e547d4f576.jpg',
    ],
  },
  {
    id: 'cats',
    title: '고양이',
    pinCount: 6,
    updatedTime: '5시간',
    images: [
      'https://i.pinimg.com/736x/61/85/83/6185831e07299cfa0307981325abbfd1.jpg',
      'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1445499348736-29b6cdfc03b9?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
  },
  {
    id: 'travel',
    title: '여행',
    pinCount: 3,
    updatedTime: '1시간',
    images: [
      'https://i.pinimg.com/736x/35/27/ab/3527ab03980bb14b74d256feaed42760.jpg',
      'https://i.pinimg.com/736x/a5/8f/b8/a58fb8936c319d851a12e8912d87f48f.jpg',
      'https://i.pinimg.com/736x/44/a8/34/44a8349122f3305efca85ac8aed033df.jpg',
    ],
  },
];

const Board = ({
  id,
  title,
  pinCount,
  updatedTime,
  images,
  onBoardClick,
}: BoardProps): JSX.Element => (
  <div
    className="w-56 flex flex-col cursor-pointer"
    onClick={() => onBoardClick(id)}
  >
    {title === '모든 핀' ? (
      <div className="relative w-full h-40">
        {images.slice(0, 5).map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`핀${5 - index}`}
            className="absolute w-3/5 h-full object-cover rounded-2xl border-2 border-white"
            style={{ left: `${index * 23}px`, zIndex: 5 - index }}
          />
        ))}
      </div>
    ) : (
      <GridBoard images={images} />
    )}
    <h3 className="text-lg font-semibold mt-2">{title}</h3>
    <div className="flex gap-2">
      <p>핀 {pinCount}개</p>
      <p className="text-gray-500">{updatedTime}</p>
    </div>
  </div>
);

type PinData = {
  id: string;
  imageUrl: string;
  creatorId: string;
  title?: string;
  description?: string;
  link?: string;
};

const Mypage = (): JSX.Element => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<'created' | 'saved'>('saved');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>('최신순');
  const [boardDataState, setBoardDataState] = useState<BoardData[]>(boardData);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [isFollowerModal, setIsFollowerModal] = useState(false);

  const [userData, setUserData] = useState<{
    id: string;
    name: string;
    profileImage: string;
    followers: { id: string; name: string; profileImage: string }[];
    following: { id: string; name: string; profileImage: string }[];
    createdPins: PinData[];
    savedPins: string[];
    createdBoards: string[];
  }>({
    id: '',
    name: '',
    profileImage: '',
    followers: [],
    following: [],
    createdPins: [],
    savedPins: [],
    createdBoards: [],
  });

  // 로그인 후 uid 가져오는 로직 추가하기
  const uid = '1'; // 임시로 1번 유저

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error('유저 데이터가 존재하지 않습니다.');
          return;
        }

        const {
          id,
          name,
          profileImage,
          followers,
          following,
          createdPins,
          savedPins,
          createdBoards,
        } = userDoc.data();

        const followerData = await Promise.all(
          followers.map(async (id: string) => {
            const followerDocRef = doc(db, 'users', id);
            const followerDoc = await getDoc(followerDocRef);
            return followerDoc.exists() ? { id, ...followerDoc.data() } : null;
          }),
        );

        const followingData = await Promise.all(
          following.map(async (id: string) => {
            const followingDocRef = doc(db, 'users', id);
            const followingDoc = await getDoc(followingDocRef);
            return followingDoc.exists()
              ? { id, ...followingDoc.data() }
              : null;
          }),
        );

        const createdPinData = await Promise.all(
          createdPins.map(async (pinId: string) => {
            const pinDocRef = doc(db, 'pins', pinId); // 핀 문서 참조
            const pinDoc = await getDoc(pinDocRef);

            if (pinDoc.exists()) {
              return { id: pinDoc.id, ...pinDoc.data() }; // 문서 ID를 `id`로 추가
            } else {
              return null;
            }
          }),
        );

        const validCreatedPins = createdPinData
          .filter((pin): pin is DocumentData => pin !== null)
          .map((pin) => ({
            id: pin.id,
            imageUrl: pin.imageUrl,
            creatorId: pin.creatorId,
            title: pin.title,
            description: pin.description,
            link: pin.link,
          }));

        setUserData({
          id,
          name,
          profileImage,
          followers: followerData
            .filter((f): f is DocumentData => f !== null)
            .map((f) => ({
              id: f.id,
              name: f.name,
              profileImage: f.profileImage,
            })),
          following: followingData
            .filter((f): f is DocumentData => f !== null)
            .map((f) => ({
              id: f.id,
              name: f.name,
              profileImage: f.profileImage,
            })),
          createdPins: validCreatedPins,
          savedPins,
          createdBoards,
        });
      } catch (error) {
        console.error('유저 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchUserData();
  }, []);

  console.log(userData);

  const sortOptions = ['최신순', '알파벳순'];

  const savedPinImages: string[] = [
    'https://i.pinimg.com/736x/09/47/1b/09471b72c946fc47908b9f3bb85b1f64.jpg',
    'https://i.pinimg.com/736x/9a/4b/61/9a4b617c9677ce65cfd85f31feb4af74.jpg',
    'https://i.pinimg.com/736x/36/3c/85/363c85a67e17eed2c614abd4bbd46261.jpg',
    'https://i.pinimg.com/736x/5d/d6/46/5dd646324b252dfc7d773b2a3a793ec0.jpg',
    'https://i.pinimg.com/736x/40/87/9d/40879de94afa2902165eb59fcc3d4ff6.jpg',
    'https://i.pinimg.com/736x/7d/de/63/7dde636d316b7f683aac5fd20ce0e760.jpg',
    'https://i.pinimg.com/736x/03/32/6d/03326de049c83e53656769e547d4f576.jpg',
    'https://i.pinimg.com/736x/54/3e/06/543e063d80e1d601886d60af8a09b968.jpg',
    'https://i.pinimg.com/736x/7c/fd/c1/7cfdc13a222c1502dc1a66e6cb7438d1.jpg',
    'https://i.pinimg.com/736x/6e/f4/1a/6ef41a60399d8fc42419559e843d933e.jpg',
    'https://i.pinimg.com/736x/b8/d4/27/b8d427a981bff1a50d1b210ebe503f2a.jpg',
    'https://i.pinimg.com/736x/f2/11/59/f21159ef03eca3070c0186551c377372.jpg',
    'https://i.pinimg.com/736x/44/70/91/44709169168e363452d9b845a70b3310.jpg',
    'https://i.pinimg.com/736x/e6/2c/45/e62c4517d4e1e90a6171e8a6f2055f2d.jpg',
  ];

  useEffect(() => {
    const fixedBoard = boardData.find((board) => board.id === 'all-pins');
    const restBoards = boardData.filter((board) => board.id !== 'all-pins');

    const sortedData = restBoards.sort(
      (a, b) => parseInt(a.updatedTime) - parseInt(b.updatedTime),
    );

    setBoardDataState([fixedBoard!, ...sortedData]);
  }, []);

  const handleTabChange = (tab: 'created' | 'saved') => {
    setSelectedTab(tab);
  };

  const handleBoardClick = (id: string): void => {
    navigate(`/board/${id}`);
  };

  const handleSortChange = (option: string) => {
    setSelectedSort(option);
    setIsSortOpen(false);

    // '모든 핀'은 항상 맨 앞에
    const fixedBoard = boardDataState.find((board) => board.id === 'all-pins');
    const restBoards = boardDataState.filter(
      (board) => board.id !== 'all-pins',
    );

    const sortedData = restBoards.sort((a, b) => {
      if (option === '최신순') {
        return parseInt(a.updatedTime) - parseInt(b.updatedTime);
      } else if (option === '알파벳순') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setBoardDataState([fixedBoard!, ...sortedData]);
  };

  const BoardModal = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState(userData.following);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
      if (searchTerm === '') {
        setFilteredUsers(userData.following);
      } else {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        setFilteredUsers(
          userData.following.filter(
            (user) =>
              user.name.toLowerCase().includes(lowerCaseSearchTerm) ||
              user.id.toLowerCase().includes(lowerCaseSearchTerm),
          ),
        );
      }
    }, [searchTerm, userData.following]);

    const handleAddUser = (id: string) => {
      setSelectedUsers((prev) =>
        prev.includes(id)
          ? prev.filter((userId) => userId !== id)
          : [...prev, id],
      );
    };

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold m-4 text-center">
            보드 만들기
          </h2>

          <label htmlFor="boardName" className="block font-medium mb-1">
            이름
          </label>
          <input
            id="boardName"
            type="text"
            placeholder="예: '가고 싶은 곳' 또는 '요리법'"
            className="w-full p-2 border rounded-xl mb-4"
          />

          <div className="flex gap-2 mb-6">
            <input
              id="privateBoard"
              type="checkbox"
              className="w-6 h-6 mt-2 cursor-pointer"
            />
            <div className="flex flex-col justify-center leading-tight">
              <label
                htmlFor="privateBoard"
                className="font-semibold text-base cursor-pointer"
              >
                비밀보드로 유지
              </label>
              <p className="text-gray-500 text-sm mt-1">
                회원님과 참여자만 볼 수 있습니다.
              </p>
            </div>
          </div>

          <div className="relative w-full mb-4">
            <label htmlFor="addUser" className="block font-medium mb-1">
              참여자 추가
            </label>
            <div>
              <FaSearch className="absolute left-3 top-12 transform -translate-y-1/2 text-gray-400" />
              <input
                id="addUser"
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="이름 또는 이메일 검색"
                className="w-full p-2 pl-10 border rounded-xl mb-4"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-gray-500 text-sm">@{user.id}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddUser(user.id)}
                  className={`px-4 py-2 rounded-full ${
                    selectedUsers.includes(user.id)
                      ? 'bg-black text-white'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {selectedUsers.includes(user.id) ? '추가됨' : '추가'}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsBoardModalOpen(false)}
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              취소
            </button>
            <button
              onClick={() => {
                alert(
                  `보드가 생성되었습니다. 참여자: ${selectedUsers.join(', ')}`,
                );
                setIsBoardModalOpen(false);
              }}
              className="px-4 py-2 bg-[#e60023] text-white rounded-full hover:bg-[#cc001f]"
            >
              만들기
            </button>
          </div>
        </div>
      </div>
    );
  };

  const FollowModal = ({ isFollower }: { isFollower: boolean }) => {
    const data = isFollower ? userData.followers : userData.following;

    const handleFollowToggle = async (id: string) => {
      try {
        const currentUserId = uid;

        // Firestore 쿼리로 입력된 id에 해당하는 문서 가져오기
        const userQuery = query(collection(db, 'users'), where('id', '==', id));
        const userSnapshot = await getDocs(userQuery);

        if (userSnapshot.empty) {
          console.error('해당 사용자 ID를 찾을 수 없습니다.');
          return;
        }

        // Firestore 문서의 uid 가져오기
        const targetDoc = userSnapshot.docs[0];
        const targetUid = targetDoc.id;

        const targetUserRef = doc(db, 'users', targetUid);
        const currentUserRef = doc(db, 'users', currentUserId);

        const targetUserDoc = await getDoc(targetUserRef);

        if (!targetUserDoc.exists()) {
          console.error('해당 사용자 데이터를 찾을 수 없습니다.');
          return;
        }

        const isFollowing = userData.following.some((user) => user.id === id);

        if (isFollowing) {
          // 언팔로우
          await Promise.all([
            updateDoc(targetUserRef, {
              followers: arrayRemove(currentUserId),
            }),
            updateDoc(currentUserRef, {
              following: arrayRemove(targetUid),
            }),
          ]);

          setUserData((prev) => ({
            ...prev,
            following: prev.following.filter((user) => user.id !== id),
          }));
        } else {
          // 팔로우
          await Promise.all([
            updateDoc(targetUserRef, {
              followers: arrayUnion(currentUserId),
            }),
            updateDoc(currentUserRef, {
              following: arrayUnion(targetUid),
            }),
          ]);

          const newFollowingUser = {
            id: targetUserDoc.data().id,
            name: targetUserDoc.data().name,
            profileImage: targetUserDoc.data().profileImage,
          };

          setUserData((prev) => ({
            ...prev,
            following: [...prev.following, newFollowingUser],
          }));
        }
      } catch (error) {
        console.error('팔로우/언팔로우 처리 중 오류 발생:', error);
      }
    };

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-20">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-semibold m-4 text-center relative">
            {isFollower ? `팔로워 ${data.length}명` : `팔로잉 ${data.length}명`}
            <IoClose
              size={30}
              onClick={() => setIsFollowModalOpen(false)}
              className="absolute top-0 right-0 cursor-pointer"
            />
          </h2>
          <div className="flex flex-col gap-3">
            {data.map((user) => {
              const isFollowing = userData.following.some(
                (followingUser) => followingUser.id === user.id,
              );

              return (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-2 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.profileImage}
                      alt="profile"
                      className="w-10 h-10 rounded-full"
                    />
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFollowToggle(user.id)}
                      className={`px-4 py-2 rounded-full ${
                        isFollowing
                          ? 'bg-black text-white'
                          : 'bg-[#e60023] text-white hover:bg-[#cc001f]'
                      }`}
                    >
                      {isFollowing ? '언팔로우' : '팔로우'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="pb-4 mb-6 text-center">
        <img
          src={userData.profileImage}
          alt="프로필 사진"
          className="w-32 h-32 object-cover rounded-full bg-gray-200 mx-auto"
        />
        <h2 className="text-2xl font-bold mt-2">{userData.name}</h2>
        <p className="text-gray-600 text-sm">@{userData.id}</p>
        <div className="flex justify-center">
          <p
            onClick={() => {
              setIsFollowModalOpen(true);
              setIsFollowerModal(true);
            }}
            className="cursor-pointer"
          >
            팔로워 {userData.followers.length}명
          </p>
          <p className="pl-2 pr-2">·</p>
          <p
            onClick={() => {
              setIsFollowModalOpen(true);
              setIsFollowerModal(false);
            }}
            className="cursor-pointer"
          >
            팔로잉 {userData.following.length}명
          </p>
        </div>

        <div className="mt-4 flex justify-center gap-4">
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
            공유
          </button>
          <button className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300">
            프로필 수정
          </button>
        </div>
      </div>

      <div className="flex mb-4 justify-center">
        <button
          onClick={() => handleTabChange('created')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'created'
              ? 'border-b-2 border-black'
              : 'text-gray-500'
          }`}
        >
          생성됨
        </button>
        <button
          onClick={() => handleTabChange('saved')}
          className={`px-4 py-2 font-medium ${
            selectedTab === 'saved'
              ? 'border-b-2 border-black'
              : 'text-gray-500'
          }`}
        >
          저장됨
        </button>
      </div>

      {selectedTab === 'saved' ? (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between relative">
              <div>
                <TbAdjustmentsHorizontal
                  size={30}
                  onClick={() => setIsSortOpen((prev) => !prev)}
                  className="cursor-pointer"
                />

                {isSortOpen && (
                  <div className="absolute mt-2 bg-white border rounded shadow-md z-10">
                    {sortOptions.map((option) => (
                      <div
                        key={option}
                        onClick={() => handleSortChange(option)}
                        className="p-2 hover:bg-gray-200 flex justify-between items-center cursor-pointer"
                      >
                        {option} {selectedSort === option && <FaCheck />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <FaPlus
                  size={30}
                  onClick={() => setIsPlusOpen((prev) => !prev)}
                  className="cursor-pointer"
                />

                {isPlusOpen && (
                  <div className="absolute right-0 mt-2 bg-white border rounded shadow-md">
                    <div
                      onClick={() => {
                        navigate('/create-pin');
                        setIsPlusOpen(false);
                      }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      핀 만들기
                    </div>
                    <div
                      onClick={() => {
                        setIsBoardModalOpen(true);
                        setIsPlusOpen(false);
                      }}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      보드 만들기
                    </div>
                  </div>
                )}
              </div>
            </div>
            {isBoardModalOpen && <BoardModal />}
            {isFollowModalOpen && <FollowModal isFollower={isFollowerModal} />}
            <div className="flex flex-row flex-wrap gap-5 border-b-2 pb-8">
              {boardDataState.map((board: BoardData) => (
                <Board
                  key={board.id}
                  {...board}
                  onBoardClick={handleBoardClick}
                />
              ))}
            </div>
          </div>

          <div className="pt-4">
            <MasonryLayout images={savedPinImages} />
          </div>
        </>
      ) : (
        <div className="pt-4">
          <MasonryLayout
            images={userData.createdPins.map((pin) => pin.imageUrl)}
          />
        </div>
      )}
    </div>
  );
};

export default Mypage;
