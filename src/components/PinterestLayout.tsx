import React, { useEffect, useState } from 'react';
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
} from 'firebase/firestore';
import { db } from '../firebase';
// import { useParams } from 'react-router-dom';
import { getDownloadURL, getStorage, ref } from '@firebase/storage';
import { AppDispatch } from '../store';
import { setCreatedBoards } from '../features/boardSlice';

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

    // Firestore의 특정 컬렉션에 데이터 추가 (예: 'pins')
    await setDoc(doc(db, 'pins', imageName), pinData);

    console.log('Image URL saved to Firestore:', imageUrl);
  } catch (error) {
    console.error('Error getting image URL or saving to Firestore:', error);
  }
};

export const fetchPins = async (): Promise<PinData[]> => {
  const pinsCollection = collection(db, 'pins');
  const pinSnapshot = await getDocs(pinsCollection);
  const pins: PinData[] = pinSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id, // Firestore 문서 ID를 id로 설정
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
  return pins;
};

const PinterestLayout: React.FC = () => {
  const [pins, setPins] = useState<PinData[]>([]);
  useEffect(() => {
    const getPins = async () => {
      const fetchedPins = await fetchPins();
      setPins(fetchedPins);
    };

    getPins();
  }, []);

  return (
    <div className="columns-2 sm:columns-3 lg:columns-5 py-2 md:py-5 gap-4 px-2 mt-12">
      {pins.map((pin) => (
        <div key={pin.id} className="mb-4 break-inside-avoid">
          <Pin src={pin.src} id={pin.id} />
        </div>
      ))}
    </div>
  );
};

export default PinterestLayout;
