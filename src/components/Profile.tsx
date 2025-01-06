import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { TbAdjustmentsHorizontal } from 'react-icons/tb';
import { FaCheck, FaPlus } from 'react-icons/fa6';
import { FaSearch, FaLink } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { FiShare } from 'react-icons/fi';
import GridBoard from './GridBoard';
import MasonryLayout from './MasonryLayout';
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

type ProfileProps = {
  uid: string;
  isCurrentUser: boolean;
};

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

const formatRelativeTime = (timestamp: any): string => {
  if (!timestamp) return '';
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true, locale: ko });
};

const Board = ({
  id,
  title,
  pinCount,
  updatedTime,
  images,
  onBoardClick,
}: BoardProps): JSX.Element => {
  const filledImages =
    images.length < 5
      ? [...images, ...Array(5 - images.length).fill(null)]
      : images.slice(0, 5);

  return (
    <div
      className="w-56 flex flex-col cursor-pointer"
      onClick={() => onBoardClick(id)}
    >
      {title === '모든 핀' ? (
        <div className="relative w-full h-40">
          {filledImages
            .slice(0, 5)
            .map((image, index) =>
              image ? (
                <img
                  key={index}
                  src={image}
                  alt={`핀${5 - index}`}
                  className="absolute w-3/5 h-full object-cover rounded-2xl border-2 border-white"
                  style={{ left: `${index * 23}px`, zIndex: 5 - index }}
                />
              ) : (
                <div
                  key={index}
                  className="absolute w-3/5 h-full bg-gray-200 rounded-2xl border-2 border-white"
                  style={{ left: `${index * 23}px`, zIndex: 5 - index }}
                />
              ),
            )}
        </div>
      ) : (
        <GridBoard images={images} />
      )}
      <h3 className="text-lg font-semibold mt-2">{title}</h3>
      <div className="flex gap-2">
        <p>핀 {pinCount}개</p>
        <p className="text-gray-500">{formatRelativeTime(updatedTime)}</p>
      </div>
    </div>
  );
};

type PinData = {
  id: string;
  imageUrl: string;
  creatorId: string;
  title?: string;
  description?: string;
  link?: string;
};

type User = {
  id: string;
  name: string;
  profileImage: string;
};

const Profile = ({ uid, isCurrentUser }: ProfileProps): JSX.Element => {
  const navigate = useNavigate();

  const [selectedTab, setSelectedTab] = useState<'created' | 'saved'>('saved');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>('최신순');
  const [boardDataState, setBoardDataState] = useState<BoardData[]>([]);
  const [isPlusOpen, setIsPlusOpen] = useState(false);
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [isFollowerModal, setIsFollowerModal] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const [userData, setUserData] = useState<{
    id: string;
    name: string;
    profileImage: string;
    followers: { id: string; name: string; profileImage: string }[];
    following: { id: string; name: string; profileImage: string }[];
    createdPins: PinData[];
    savedPins: PinData[];
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

  const defaultProfileImage =
    'https://i.pinimg.com/736x/3b/73/a1/3b73a13983f88f8b84e130bb3fb29e17.jpg';

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

        const allPinIds = [...new Set([...createdPins, ...savedPins])];
        const allPinsData = await Promise.all(
          allPinIds.map(async (pinId: string) => {
            const pinDocRef = doc(db, 'pins', pinId);
            const pinDoc = await getDoc(pinDocRef);

            if (pinDoc.exists()) {
              const pinData = pinDoc.data() as { imageUrl: string };
              return pinData.imageUrl;
            } else {
              console.warn(`핀 ID ${pinId}를 찾을 수 없습니다.`);
              return null;
            }
          }),
        );

        const allPinsBoard: BoardData = {
          id: 'all-pins',
          title: '모든 핀',
          pinCount: allPinIds.length,
          updatedTime: '',
          images: allPinsData.filter((url): url is string => url !== null),
        };

        const boardQuery = query(
          collection(db, 'boards'),
          where('ownerId', '==', uid),
        );
        const boardSnapshot = await getDocs(boardQuery);

        const boardsData: BoardData[] = await Promise.all(
          boardSnapshot.docs.map(async (boardDoc) => {
            const board = boardDoc.data();
            const pinsData = await Promise.all(
              (board.pins || []).map(async (pinId: string) => {
                const pinDocRef = doc(db, 'pins', pinId);
                const pinDoc = await getDoc(pinDocRef);

                if (pinDoc.exists()) {
                  const pinData = pinDoc.data() as { imageUrl: string };
                  return pinData.imageUrl;
                } else {
                  return null;
                }
              }),
            );

            return {
              id: boardDoc.id,
              title: board.title || '제목 없음',
              pinCount: (board.pins || []).length,
              updatedTime: board.updatedTime?.toDate(),
              images: pinsData.filter((url): url is string => url !== null),
            };
          }),
        );

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
            const pinDocRef = doc(db, 'pins', pinId);
            const pinDoc = await getDoc(pinDocRef);

            if (pinDoc.exists()) {
              return { id: pinDoc.id, ...pinDoc.data() };
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

        const savedPinData = await Promise.all(
          savedPins.map(async (pinId: string) => {
            const pinDocRef = doc(db, 'pins', pinId);
            const pinDoc = await getDoc(pinDocRef);
            return pinDoc.exists() ? { id: pinDoc.id, ...pinDoc.data() } : null;
          }),
        );

        const validSavedPins = savedPinData
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
          savedPins: validSavedPins,
          createdBoards,
        });

        setBoardDataState(() => {
          const fixedBoard = allPinsBoard;
          const restBoards = boardsData;

          const sortedBoards = restBoards.sort((a, b) => {
            const timeA = new Date(a.updatedTime).getTime();
            const timeB = new Date(b.updatedTime).getTime();
            return timeB - timeA;
          });

          return [fixedBoard, ...sortedBoards];
        });
      } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchUserData();
  }, []);

  console.log(userData);

  const sortOptions = ['최신순', '알파벳순'];

  const handleShareClick = () => {
    setIsShareModalOpen((prev) => !prev);
  };

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
        const timeA = new Date(a.updatedTime).getTime();
        const timeB = new Date(b.updatedTime).getTime();
        return timeB - timeA;
      } else if (option === '알파벳순') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    setBoardDataState([fixedBoard!, ...sortedData]);
  };

  const BoardModal = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

    useEffect(() => {
      const fetchAllUsers = async () => {
        if (searchTerm === '') {
          setFilteredUsers(userData.following);
        } else {
          const usersQuery = query(
            collection(db, 'users'),
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff'),
          );

          const userSnapshot = await getDocs(usersQuery);
          const allUsers = userSnapshot.docs.map((doc) => ({
            id: doc.data().id,
            name: doc.data().name || '',
            profileImage: doc.data().profileImage || '',
          }));

          setFilteredUsers(allUsers);
        }
      };

      fetchAllUsers();
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
                className="w-full p-2 pl-10 border-2 border-gray-300 rounded-full mb-4"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={user.profileImage || defaultProfileImage}
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
                      : 'bg-btn_gray hover:bg-btn_h_gray'
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
              className="px-4 py-2 bg-btn_gray rounded-full hover:bg-btn_h_gray"
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
              className="px-4 py-2 bg-btn_red text-white rounded-full hover:bg-btn_h_red"
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
                      src={user.profileImage || defaultProfileImage}
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
                          : 'bg-btn_red text-white hover:bg-btn_h_red'
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

  const ShareModal = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [copied, setCopied] = useState(false);
    const currentUrl = window.location.href;
    const facebookAppId = process.env.REACT_APP_FACEBOOK_APP_ID;

    useEffect(() => {
      const fetchAllUsers = async () => {
        if (searchTerm === '') {
          setFilteredUsers(userData.following);
        } else {
          const usersQuery = query(
            collection(db, 'users'),
            where('name', '>=', searchTerm),
            where('name', '<=', searchTerm + '\uf8ff'),
          );

          const userSnapshot = await getDocs(usersQuery);
          const allUsers = userSnapshot.docs.map((doc) => ({
            id: doc.data().id,
            name: doc.data().name || '',
            profileImage: doc.data().profileImage || '',
          }));

          setFilteredUsers(allUsers);
        }
      };

      fetchAllUsers();
    }, [searchTerm, userData.following]);

    const handleSend = (id: string) => {
      alert(`${id}에게 내 프로필을 보냈습니다.`);
      // 메시지로 내 프로필 보내는 로직 추가하기
    };

    const handleCopyLink = () => {
      navigator.clipboard
        .writeText(currentUrl)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 3000);
        })
        .catch((err) => {
          console.error('링크 복사 실패:', err);
        });
    };

    const handleTwitterShare = () => {
      const text = 'Pinterest에서 꼭 팔로우해야 할 사람을 찾았습니다.';

      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text,
      )}&url=${encodeURIComponent(currentUrl)}&via=pinterest`;

      window.open(twitterUrl, 'twitter-share-dialog', 'width=600,height=400');
    };

    const handleFacebookShare = () => {
      const currentUrl = 'https://example.com'; // Open Graph 태그가 있는 URL 이어야 공유 시 링크가 뜸. 현재 로컬호스트는 링크가 안떠서 임시 URL

      const facebookUrl = `https://www.facebook.com/dialog/share?app_id=${facebookAppId}&href=${encodeURIComponent(
        currentUrl,
      )}&display=popup`;

      window.open(facebookUrl, 'facebook-share-dialog', 'width=600,height=400');
    };

    const handleMessengerShare = () => {
      const currentUrl = 'https://example.com'; // Open Graph 태그가 있는 URL 이어야 공유 시 링크가 뜸. 현재 로컬호스트는 링크가 안떠서 임시 URL

      const messengerUrl = `fb-messenger://share?link=${encodeURIComponent(
        currentUrl,
      )}&app_id=${facebookAppId}`;

      const browserMessengerUrl = `https://www.facebook.com/dialog/send?link=${encodeURIComponent(
        currentUrl,
      )}&app_id=${facebookAppId}&redirect_uri=${encodeURIComponent(currentUrl)}`;

      if (navigator.userAgent.match(/FBAN|FBAV/i)) {
        // Messenger 앱이 설치된 경우 실행
        window.open(messengerUrl, '_blank');
      } else {
        // 일반 웹 브라우저 환경
        window.open(
          browserMessengerUrl,
          'messenger-share-dialog',
          'width=600,height=400',
        );
      }
    };

    return (
      <div
        className="bg-white p-6 rounded-xl shadow-lg w-96 absolute top-11"
        style={{ left: '40%', boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)' }}
      >
        <p className="mb-4 text-center">공유</p>
        <div className="flex justify-evenly mb-4 pb-4 border-b-2">
          <button
            className="flex flex-col items-center"
            onClick={handleCopyLink}
          >
            <FaLink className="w-10 h-10 mb-2 bg-gray-200 rounded-full pl-3 pr-3" />
            <span className="text-xs">
              {copied ? '복사 완료' : '링크 복사'}
            </span>
          </button>
          <a
            href={`https://web.whatsapp.com/send?text=${encodeURIComponent(currentUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center"
          >
            <img
              src="https://cdn.pixabay.com/photo/2021/12/10/16/38/whatsapp-6860919_1280.png"
              alt="WhatsApp"
              className="w-10 h-10 rounded-full mb-2"
            />
            <span className="text-xs">WhatsApp</span>
          </a>
          <button
            className="flex flex-col items-center"
            onClick={handleMessengerShare}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Facebook_Messenger_logo_2020.svg/2048px-Facebook_Messenger_logo_2020.svg.png"
              alt="FacebookMessenger"
              className="w-10 h-10 mb-2"
            />
            <span className="text-xs">Messenger</span>
          </button>
          <button
            className="flex flex-col items-center"
            onClick={handleFacebookShare}
          >
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Facebook_f_logo_%282019%29.svg/1280px-Facebook_f_logo_%282019%29.svg.png"
              alt="Facebook"
              className="w-10 h-10 mb-2"
            />
            <span className="text-xs">Facebook</span>
          </button>

          <button
            className="flex flex-col items-center"
            onClick={handleTwitterShare}
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo9rzArm7GEm9dZBAFHhS_BSPvuBiuPnXwcg&s"
              alt="Twitter"
              className="w-10 h-10 mb-2"
            />
            <span className="text-xs">X</span>
          </button>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/4 text-gray-500" />
          <input
            id="searchUser"
            type="text"
            placeholder="이름 또는 이메일 검색"
            className="w-full p-2 pl-10 border-2 border-gray-300 rounded-full mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 max-h-60 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-2"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage || defaultProfileImage}
                  alt="profile"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-sm">@{user.id}</p>
                </div>
              </div>
              <button
                onClick={() => handleSend(user.id)}
                className="px-4 py-2 bg-btn_gray rounded-full hover:bg-btn_h_gray"
              >
                보내기
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="pb-4 mb-6 text-center">
        <img
          src={userData.profileImage || defaultProfileImage}
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

        <div
          className={`mt-4 flex justify-center gap-4 relative ${
            !isCurrentUser ? '-translate-x-8' : ''
          } transition-transform`}
        >
          <button
            onClick={handleShareClick}
            className={`px-4 py-2 rounded-full ${
              isShareModalOpen
                ? 'bg-black text-white'
                : isCurrentUser
                  ? 'bg-btn_gray hover:bg-btn_h_gray'
                  : 'bg-white hover:bg-btn_h_gray'
            }`}
          >
            {isCurrentUser ? '공유' : <FiShare className="w-5 h-5" />}
          </button>
          {isShareModalOpen && <ShareModal />}
          <>
            {isCurrentUser ? (
              <button
                className="px-4 py-2 bg-btn_gray rounded-full hover:bg-btn_h_gray"
                onClick={() => navigate('/settings/edit-profile')}
              >
                프로필 수정
              </button>
            ) : (
              <div className="flex justify-center gap-4">
                <button className="px-4 py-2 rounded-full bg-btn_gray hover:bg-btn_h_gray">
                  메시지
                </button>
                <button className="px-4 py-2 rounded-full bg-btn_red text-white hover:bg-btn_h_red">
                  팔로우
                </button>
              </div>
            )}
          </>
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
                        className="p-2 hover:bg-btn_h_gray flex justify-between items-center cursor-pointer"
                      >
                        {option} {selectedSort === option && <FaCheck />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <>
                {isCurrentUser ? (
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
                            navigate('/pin-creation-tool');
                            setIsPlusOpen(false);
                          }}
                          className="p-2 hover:bg-btn_h_gray cursor-pointer"
                        >
                          핀 만들기
                        </div>
                        <div
                          onClick={() => {
                            setIsBoardModalOpen(true);
                            setIsPlusOpen(false);
                          }}
                          className="p-2 hover:bg-btn_h_gray cursor-pointer"
                        >
                          보드 만들기
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </>
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
            <MasonryLayout
              images={userData.savedPins.map((pin) => pin.imageUrl)}
            />
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

export default Profile;
