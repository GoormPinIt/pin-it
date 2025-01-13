import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
} from 'firebase/firestore';
import { db } from '../firebase';

import { Board } from '../types';
import { createAction } from '@reduxjs/toolkit';

const getPinImageUrl = async (pinId: string): Promise<string> => {
  try {
    if (pinId === '') return '';

    const pinDocRef = doc(db, 'pins', pinId);
    const pinDoc = await getDoc(pinDocRef);

    if (pinDoc.exists()) {
      const pinData = pinDoc.data();
      return pinData.imageUrl || '';
    }
  } catch (error) {
    console.error(`Error fetching pin image for pinId ${pinId}:`, error);
  }

  return '';
};

export const fetchBoards = async (userId: string): Promise<Board[]> => {
  try {
    const boardsRef = collection(db, 'boards');
    const q = query(boardsRef, where('ownerId', 'array-contains', userId)); // ownerId에 userId가 포함된 문서 필터링
    const querySnapshot = await getDocs(q);

    const boards: Board[] = await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // 보드의 첫 번째 핀 ID 가져오기
        const firstPinId = data.pins?.[0] || '';

        // 첫 번째 핀의 URL 가져오기
        const iconUrl = firstPinId ? await getPinImageUrl(firstPinId) : '';

        return {
          id: doc.id,
          description: data.description || '',
          isPrivate: data.isPrivate || false,
          ownerIds: Array.isArray(data.ownerId) ? data.ownerId : [], // 소유자 ID 배열
          pins: {
            pinId: Array.isArray(data.pins?.pinId) ? data.pins.pinId : [], // 핀 ID 배열
          },
          title: data.title || 'Untitled Board',
          icon: iconUrl,
        };
      }),
    );

    return boards;
  } catch (error) {
    console.error('Error fetching boards with icons:', error);
    return [];
  }
};

export const setBoards = createAction<Board[]>('boards/setBoards');
