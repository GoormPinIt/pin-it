import React, { useEffect, useRef, useState } from 'react';
import Pin from './Pin';
// import { getStorage } from 'firebase/storage';
import {
  doc,
  collection,
  getDoc,
  getDocs,
  setDoc,
  query,
  where,
  QueryDocumentSnapshot,
  DocumentData,
  orderBy,
  startAfter,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase';
// import { useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { AppDispatch } from '../store';
import { setCreatedBoards } from '../features/boardSlice';
import { m } from 'framer-motion';

interface PinData {
  id: string; // 고유 ID
  src: string; // 이미지 URL
  allowComments: boolean;
  board: string;
  creatorId: string;
  description: string;
  link: string;
  showSimilarProducts: boolean;
  tag: string;
  title: string;
}

interface Board {
  id: string;
  description: string;
  title: string;
  ownerId: string;
  isPrivate: boolean;
}

export const fetchCreatedBoards =
  (userId: string) => async (dispatch: AppDispatch) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', userId));
      const userData = userDoc.data();
      const createdBoardIds = userData?.createdBoards || [];
      const boardsData = await Promise.all(
        createdBoardIds.map(async (boardId: string) => {
          const boardDoc = await getDoc(doc(db, 'boards', boardId));
          return {
            id: boardDoc.id,
            description: boardDoc.data()?.description || '',
            title: boardDoc.data()?.title || '',
            ownerId: boardDoc.data()?.ownerId || '',
            isPrivate: boardDoc.data()?.isPrivate || false,
          };
        }),
      );
      dispatch(setCreatedBoards(boardsData));
      const boardQuery = query(
        collection(db, 'boards'),
        where('ownerId', '==', userId), // createdBoard를 가져오기 위해 userId 필터링
      );
      const querySnapshot = await getDocs(boardQuery);
      const createdBoards = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      dispatch(setCreatedBoards(boardsData)); // Redux에 createdBoard 데이터 저장
    } catch (error) {
      console.error('Error fetching created boards:', error);
    }
  };

// 이미지를 Firestore에 저장하는 함수
const saveImageToFirestore = async (imageName: string, userId: string) => {
  const storage = getStorage();
  const storageRef = ref(storage, `uploads/${imageName}`);

  try {
    // Firebase Storage에서 이미지 URL 가져오기
    const imageUrl = await getDownloadURL(storageRef);

    // Firestore에 이미지 URL 저장
    const pinData = {
      imageUrl,
      userId,
      timestamp: new Date(),
    };
    await setDoc(doc(db, 'pins', imageName), pinData);

    console.log('Image URL saved to Firestore:', imageUrl);
  } catch (error) {
    console.error('Error getting image URL or saving to Firestore:', error);
  }
};

export const fetchPins = async (
  lastVisibleDoc: QueryDocumentSnapshot<DocumentData> | null = null,
): Promise<{
  pins: PinData[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
}> => {
  const pinsCollection = collection(db, 'pins');
  let pinsQuery = query(pinsCollection, orderBy('createdAt'), limit(20));

  if (lastVisibleDoc) {
    pinsQuery = query(
      pinsCollection,
      orderBy('createdAt'),
      startAfter(lastVisibleDoc),
      limit(20),
    );
  }
  const pinSnapshot = await getDocs(pinsQuery);
  const lastVisible =
    pinSnapshot.docs.length > 0
      ? pinSnapshot.docs[pinSnapshot.docs.length - 1]
      : null;
  // const next = async () => {
  //   const nextQuery = query(
  //     collection(db, 'pins'),
  //     orderBy('createdAt'),
  //     startAfter(lastVisible),
  //     limit(15),
  //   );
  //   const pinSnapshot = await getDocs(nextQuery);
  // };
  const pins: PinData[] = pinSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id, // Firestore 문서 ID를 id로 설정qq
      src: data.imageUrl || '', // imageUrl을 src로 매핑
      allowComments: data.allowComments || false,
      board: data.board || '',
      creatorId: data.creatorId || '',
      description: data.description || '',
      link: data.link || '',
      showSimilarProducts: data.showSimilarProducts || false,
      tag: data.tag || '',
      title: data.title || '',
    };
  });
  return { pins, lastVisible };
};

const PinterestLayout: React.FC = () => {
  const [pins, setPins] = useState<PinData[]>([]);
  const [lastVisible, setLastVisible] =
    useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loading, setLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [showObserver, setShowObserver] = useState(false);

  const isFetching = useRef(false);
  const loadMorePins = async () => {
    if (loading || isFetching.current || !hasMore) return;
    isFetching.current = true;
    console.log('loading', loading);
    console.log('hasMore', hasMore);
    setLoading(true);
    const fetchedPins = await fetchPins(lastVisible);
    // setPins((prevPins) => [...prevPins, ...fetchedPins.pins]);
    if (fetchedPins.pins.length === 0) {
      console.log('no more pins to load');
      setHasMore(false);
    }

    setPins((prevPins) => {
      const newPins = fetchedPins.pins.filter(
        (newPin) => !prevPins.some((pin) => pin.id === newPin.id),
      );
      return [...prevPins, ...newPins];
    });
    setLastVisible(fetchedPins.lastVisible);
    setLoading(false);

    isFetching.current = false;
    console.log('Fetching ended');
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowObserver(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchInitialPins = async () => {
      if (!isFirstLoad) return;
      await loadMorePins();
      setIsFirstLoad(false);
    };

    fetchInitialPins();
  }, [isFirstLoad]);

  useEffect(() => {
    if (!observerTarget.current || isFirstLoad) return;
    console.log('observer target:', observerTarget.current);
    const observer = new IntersectionObserver(
      async (entries) => {
        if (entries[0].isIntersecting && !loading) {
          observer.disconnect();
          await loadMorePins();
          // setTimeout(() => {
          //   observer.observe(observerTarget.current!);
          // }, 2000);
        }
      },
      { threshold: 1 },
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="columns-2 sm:columns-3 lg:columns-5 py-2 md:py-5 gap-4 px-2 mt-0">
      {pins.map((pin) => (
        <div key={pin.id} className="mb-4 break-inside-avoid">
          <Pin src={pin.src} id={pin.id} />
        </div>
      ))}
      {!loading && (
        <div
          ref={observerTarget}
          style={{ opacity: showObserver ? 1 : 0, transition: 'opacity 1s' }}
          className="h-24"
        ></div>
      )}
      {loading && hasMore && (
        <p
          className="text-center mt-4"
          style={{ opacity: showObserver ? 1 : 0, transition: 'opacity 1s' }}
        >
          Loading...
        </p>
      )}
      <div style={{ opacity: loading ? 1 : 0, transition: 'opacity 1s' }}>
        <span>skeleton Loading..</span>
      </div>
    </div>
  );
};

export default PinterestLayout;
