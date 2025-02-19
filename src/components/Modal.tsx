import React, { useEffect, useRef, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { FaRegPenToSquare } from 'react-icons/fa6';
import LiveMessage from './LiveMessage';
import { io, Socket } from 'socket.io-client';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  getDocs,
  orderBy,
  Timestamp,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  where,
} from 'firebase/firestore';
import useCurrentUserUid from '../hooks/useCurrentUserUid';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

interface Message {
  id?: string;
  sender: string;
  receiver: string;
  text: string;
  time: string;
}

const socket: Socket = io(
  'http://ec2-3-39-21-117.ap-northeast-2.compute.amazonaws.com:4000/',
);
const db = getFirestore();

const generateChatId = (user1: string, user2: string): string => {
  const sortedUsers = [user1, user2].sort();
  return `${sortedUsers[0]}_${sortedUsers[1]}`;
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title }) => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [chatUsers, setChatUsers] = useState<string[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [isNewMessage, setIsNewMessage] = useState(false);
  const [newMessageReceiver, setNewMessageReceiver] = useState('');
  const [newMessageText, setNewMessageText] = useState('');
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const currentUserUid = useCurrentUserUid();
  const [searchResults, setSearchResults] = useState<
    { uid: string; name: string; profileImage?: string }[]
  >([]);
  const dropdownRef = useRef<HTMLDivElement | null>(null); // 검색 결과 목록 영역
  const modalRef = useRef<HTMLDivElement | null>(null); // 모달 영역
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [followers, setFollowers] = useState<
    { uid: string; name: string; profileImage?: string }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUserData = async () => {
    if (!currentUserUid) return;

    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const nameMapping: Record<string, string> = {};
      let currentName = '';

      querySnapshot.forEach((doc) => {
        const { name, uid } = doc.data();
        if (uid && name) {
          nameMapping[uid] = name;
        }
        if (uid === currentUserUid) {
          currentName = name;
        }
      });

      setUserNames(nameMapping);
      setCurrentUserName(currentName);
    } catch (error) {
      console.error('사용자 데이터 가져오는 중 오류 발생:', error);
    }
  };
  useEffect(() => {
    const fetchChatUsers = async () => {
      if (!currentUserUid) return;

      try {
        const userChatsRef = doc(db, 'userChats', currentUserUid);
        const userChatsDoc = await getDoc(userChatsRef);

        if (userChatsDoc.exists()) {
          setChatUsers(userChatsDoc.data()?.chatUsers || []);
        }
      } catch (error) {
        console.error('대화 사용자 목록 가져오기 실패:', error);
      }
    };

    fetchChatUsers();
  }, [currentUserUid, isOpen]);

  useEffect(() => {
    if (currentUserUid) {
      fetchUserData();
    }
  }, [currentUserUid]);
  useEffect(() => {
    const fetchUserNames = async () => {
      const nameMapping: Record<string, string> = {};

      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        querySnapshot.forEach((doc) => {
          const { uid, name } = doc.data();
          if (uid && name) {
            nameMapping[uid] = name;
          }
        });

        setUserNames(nameMapping);
      } catch (error) {
        console.error('사용자 이름 가져오기 실패:', error);
      }
    };

    fetchUserNames();
  }, []);

  useEffect(() => {
    if (selectedChat && currentUserName) {
      const chatId = generateChatId(currentUserName, selectedChat);
      const messagesRef = collection(db, 'messages', chatId, 'chat');

      const unsubscribe = onSnapshot(
        query(messagesRef, orderBy('time', 'asc')),
        (snapshot) => {
          const fetchedMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            sender: doc.data().sender,
            receiver: doc.data().receiver,
            text: doc.data().text,
            time: doc.data().time.toDate().toString().split(' GMT')[0],
          }));

          setMessages((prev) => {
            const existingMessages = prev[chatId] || [];
            const uniqueMessages = fetchedMessages.filter(
              (newMsg) =>
                !existingMessages.some(
                  (existingMsg) =>
                    existingMsg.text === newMsg.text &&
                    existingMsg.sender === newMsg.sender &&
                    existingMsg.time === newMsg.time,
                ),
            );
            return {
              ...prev,
              [chatId]: [...existingMessages, ...uniqueMessages],
            };
          });
        },

        (error) => {
          console.error('실시간 메시지 구독 중 오류 발생:', error);
        },
      );
      return () => unsubscribe();
    }
  }, [selectedChat, currentUserName]);

  useEffect(() => {
    const handleReceive = (data: Message) => {
      const chatId = generateChatId(data.sender, data.receiver);

      setMessages((prev) => {
        const existingMessages = prev[chatId] || [];
        const isDuplicate = existingMessages.some(
          (msg) =>
            msg.text === data.text &&
            msg.sender === data.sender &&
            msg.time === data.time,
        );

        if (isDuplicate) return prev;

        return {
          ...prev,
          [chatId]: [...existingMessages, data],
        };
      });
    };

    socket.on('receive', handleReceive);

    return () => {
      socket.off('receive', handleReceive);
    };
  }, []);

  const sendMessageToFirestore = async (
    sender: string,
    receiver: string,
    text: string,
  ) => {
    if (!sender || !receiver || !text) {
      console.error('메시지 전송에 필요한 정보가 부족합니다.');
      return;
    }

    const chatId = generateChatId(sender, receiver);
    const message: Message = {
      id: `${sender}_${receiver}_${Date.now()}`,
      sender,
      receiver,
      text,
      time: new Date().toString().split(' GMT')[0],
    };

    try {
      const messagesRef = collection(db, 'messages', chatId, 'chat');
      await addDoc(messagesRef, {
        ...message,
        time: Timestamp.now(),
      });

      socket.emit('send_message', message);
    } catch (error) {
      console.error('메시지 저장 중 오류 발생:', error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!currentUserName || !selectedChat) {
      console.error('전송에 필요한 정보가 부족합니다.');
      return;
    }

    await sendMessageToFirestore(currentUserName, selectedChat, text);
  };

  const updateChatUsers = async (receiverUid: string) => {
    if (!currentUserUid) return;

    try {
      const userChatsRef = doc(db, 'userChats', currentUserUid);
      const userChatsDoc = await getDoc(userChatsRef);

      const updatedChatUsers = userChatsDoc.exists()
        ? userChatsDoc.data()?.chatUsers || []
        : [];

      if (!updatedChatUsers.includes(receiverUid)) {
        updatedChatUsers.push(receiverUid);
        await setDoc(userChatsRef, { chatUsers: updatedChatUsers });

        // UI 상태 업데이트
        setChatUsers(updatedChatUsers);
      }
    } catch (error) {
      console.error('대화 사용자 목록 업데이트 실패:', error);
    }
  };

  const handleNewMessage = async () => {
    if (!currentUserName || !newMessageReceiver || !newMessageText) {
      console.error('새 메시지 전송에 필요한 정보가 부족합니다.');
      return;
    }

    // 메시지를 Firestore에 저장
    await sendMessageToFirestore(
      currentUserName,
      newMessageReceiver,
      newMessageText,
    );

    await updateChatUsers(newMessageReceiver);

    setIsNewMessage(false);
    setNewMessageReceiver('');
    setNewMessageText('');
  };
  useEffect(() => {
    if (!currentUserUid || !isNewMessage) return;

    const fetchFollowers = async () => {
      try {
        // 현재 유저 문서 읽기
        const userDocRef = doc(db, 'users', currentUserUid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          const followerUids: string[] = userData.followers || [];

          // 이미 가져온 userNames( uid -> 이름 )를 사용해 매핑
          const followerList: {
            uid: string;
            name: string;
            profileImage?: string;
          }[] = [];

          for (const fUid of followerUids) {
            const fDocRef = doc(db, 'users', fUid);
            const fDocSnap = await getDoc(fDocRef);

            if (fDocSnap.exists()) {
              const fData = fDocSnap.data();
              followerList.push({
                uid: fUid,
                name: fData.name || fUid,
                profileImage: fData.profileImage, // 프로필 이미지
              });
            } else {
              // 혹시 문서가 없으면 최소한 uid와 기본 이름만 넣어줍니다.
              followerList.push({
                uid: fUid,
                name: fUid,
              });
            }
          }

          setFollowers(followerList);
          // 검색 결과 초기값도 전체 팔로워 목록으로 설정
          setSearchResults(followerList);
        }
      } catch (error) {
        console.error('팔로워 목록을 가져오는 중 오류 발생:', error);
      }
    };

    fetchFollowers();
  }, [currentUserUid, isNewMessage, userNames]);
  useEffect(() => {
    const fetchChatUsers = async () => {
      if (!currentUserUid) return;

      try {
        const userChatsRef = doc(db, 'userChats', currentUserUid);
        const userChatsDoc = await getDoc(userChatsRef);

        if (userChatsDoc.exists()) {
          const chatUsers = userChatsDoc.data()?.chatUsers || []; // userChats에 저장된 이름 배열
          setChatUsers(chatUsers);
        }
      } catch (error) {
        console.error('대화 사용자 목록 가져오기 실패:', error);
      }
    };

    fetchChatUsers();
  }, [currentUserUid]);

  useEffect(() => {
    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSearchResults([]); // 목록 닫기
      }
    };
    document.addEventListener('mousedown', handleClickOutsideDropdown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideDropdown);
    };
  }, []);

  useEffect(() => {
    if (!newMessageReceiver.trim()) {
      setSearchResults(followers);
    }
  }, [newMessageReceiver, followers]);

  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutsideModal);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    };
  }, [onClose]);
  useEffect(() => {
    if (!isOpen) {
      setIsNewMessage(false);
      setNewMessageReceiver('');
      setNewMessageText('');
      setSearchTerm('');
      setSearchResults([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-12 w-full h-full rounded-lg bg-opacity-50 z-50000 flex justify-start items-center">
      <div
        ref={modalRef}
        className="w-[210px] h-[98%] bg-white shadow-lg rounded-md"
      >
        <div className="p-1 flex justify-between items-center">
          <button className="text-gray-800" onClick={onClose}>
            <IoClose />
          </button>
          <h2 className="text-xs font-bold flex-1 p-2">{title}</h2>
        </div>

        {isNewMessage ? (
          <div>
            <div className="p-1 text-sm font-bold">새 메시지</div>
            <div>
              <input
                type="text"
                placeholder="이름 검색"
                className="w-full p-2 text-xs border rounded-xl mt-2 mb-2"
                value={newMessageReceiver}
                onChange={async (e) => {
                  const term = e.target.value;
                  setNewMessageReceiver(term);

                  if (!term.trim()) {
                    setSearchResults(followers);
                  } else {
                    try {
                      const usersRef = collection(db, 'users');
                      const q = query(
                        usersRef,
                        where('name', '>=', term),
                        where('name', '<=', term + '\uf8ff'),
                      );
                      const querySnapshot = await getDocs(q);

                      const results: {
                        uid: string;
                        name: string;
                        profileImage?: string;
                      }[] = [];
                      querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        if (data.uid && data.name) {
                          results.push({
                            uid: data.uid,
                            name: data.name,
                            profileImage: data.profileImage,
                          });
                        }
                      });

                      setSearchResults(results);
                    } catch (error) {
                      console.error('사용자 검색 중 오류 발생:', error);
                    }
                  }
                }}
              />
            </div>
            {searchResults.length > 0 && (
              <div
                ref={dropdownRef}
                className="border rounded text-[12px] p-2 max-h-32 overflow-y-auto"
              >
                {searchResults.map((user) => (
                  <div
                    key={user.uid}
                    onClick={() => {
                      setNewMessageReceiver(user.name);
                      setSearchTerm(user.name);
                      setSearchResults([]);
                    }}
                    className="cursor-pointer hover:bg-gray-200 p-1 rounded flex items-center"
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt={user.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-400 mr-2 flex items-center justify-center text-white text-xs">
                        {user.name[0] || '?'}
                      </div>
                    )}
                    {user.name}
                  </div>
                ))}
              </div>
            )}

            <textarea
              placeholder="메시지 내용"
              className="w-full p-1 text-xs border rounded-xl mt-2 mb-2"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
            />

            <div className="flex gap-2">
              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 py-1 rounded text-xs"
                onClick={handleNewMessage}
              >
                메시지 보내기
              </button>

              <button
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-black py-1 rounded text-xs"
                onClick={() => setIsNewMessage(false)}
              >
                취소
              </button>
            </div>
          </div>
        ) : !selectedChat ? (
          <div>
            <div
              className="hover:bg-gray-200 rounded-lg cursor-pointer p-2"
              onClick={() => setIsNewMessage(true)}
            >
              <div className="text-xs flex">
                <button className="bg-red-600 rounded-full w-6 h-6 items-center justify-center">
                  <FaRegPenToSquare
                    style={{ fontSize: '12px', lineHeight: '1' }}
                    className="text-[15px] ml-[6px]"
                    color="#fff"
                  />
                </button>
                새 메시지
              </div>
            </div>
            <div className="text-[8px] p-2">메시지</div>
            <div className="text-xs p-1">
              {chatUsers.length === 0 ? (
                <div className="text-center text-gray-500">
                  대화 상대가 없습니다.
                </div>
              ) : (
                chatUsers.map((name) => (
                  <div
                    key={name}
                    onClick={() => setSelectedChat(name)}
                    className="flex cursor-pointer items-center justify-between pb-2 mb-2 hover:bg-gray-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-red-400 w-6 h-6 rounded-full flex items-center mt-1 justify-center text-white text-[9px]">
                        {name[0] || '?'}
                      </div>
                      <div>
                        <div className="font-bold text-[11px]">{name}</div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <LiveMessage
            sender={currentUserName}
            receiver={selectedChat}
            messages={
              messages[generateChatId(currentUserName, selectedChat)] || []
            }
            onSendMessage={(text) => sendMessage(text)}
            onClose={() => setSelectedChat(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Modal;
