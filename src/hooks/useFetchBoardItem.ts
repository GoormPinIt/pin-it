import { useState, useEffect } from 'react';
import {
  getDocs,
  getDoc,
  query,
  where,
  collection,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { BoardItem } from '../types';

export const useFetchBoardItem = (userId: string) => {
  const [boardItems, setBoardItems] = useState<BoardItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoards = async () => {
    if (!userId) {
      console.log('userId가 없습니다.');
      setBoardItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const boardsRef = collection(db, 'boards');
      const q = query(boardsRef, where('ownerId', 'array-contains', userId));
      console.log('쿼리 실행 중:', q);

      const querySnapshot = await getDocs(q);
      console.log('쿼리 결과:', querySnapshot.docs);

      // 보드 데이터를 비동기적으로 가져옴
      const boardsWithIcons = await Promise.all(
        querySnapshot.docs.map(async (d) => {
          const boardData = d.data();
          console.log('boardData:', boardData);

          // pins[0]에서 pinId를 가져와 해당 문서 조회
          const firstPinId = boardData.pins?.[0];
          console.log('firstPinId:', firstPinId);

          let icon = null;

          if (firstPinId) {
            const pinDocRef = doc(db, 'pins', firstPinId);
            console.log('pinDocRef:', pinDocRef);
            console.log(pinDocRef);

            const pinDoc = await getDoc(pinDocRef);
            console.log(
              'pinDoc:',
              pinDoc.exists() ? pinDoc.data() : '문서 없음',
            );

            if (pinDoc.exists()) {
              console.log(pinDoc);
              icon = pinDoc.data().imageUrl; // pin 문서에서 imageUrl 추출
              console.log('icon:', icon);
            }
          }

          return {
            id: d.id,
            title: boardData.title,
            icon: icon || null, // icon이 없으면 null
          } as BoardItem;
        }),
      );

      console.log('boardsWithIcons:', boardsWithIcons);

      setBoardItems(boardsWithIcons);
      setError(null);
    } catch (err) {
      console.error('보드 데이터를 가져오는 중 오류 발생:', err);
      setError('보드 데이터를 가져오는 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
      console.log('로딩 상태:', false);
    }
  };

  useEffect(() => {
    fetchBoards();
  }, [userId]);

  console.log('boardItems 상태:', boardItems);
  console.log('loading 상태:', loading);
  console.log('error 상태:', error);

  return { boardItems, loading, error, refresh: fetchBoards };
};
