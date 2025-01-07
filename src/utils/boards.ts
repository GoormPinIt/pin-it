import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

interface Board {
  id: string; // 보드 문서 ID
  description: string; // 보드 설명
  isPrivate: boolean; // 보드 공개 여부
  ownerIds: string[]; // 소유자 ID 배열
  pins: {
    pinId: string[]; // 핀 ID 배열
  };
  title: string; // 보드 제목
  icon: string; // 보드 아이콘 URL
}

export const fetchBoards = async (userId: string): Promise<Board[]> => {
  try {
    const boardsRef = collection(db, 'boards'); // 'boards' 컬렉션 참조
    const q = query(boardsRef, where('ownerId', 'array-contains', userId)); // ownerId에 userId가 포함된 문서 필터링
    const querySnapshot = await getDocs(q);

    const boards: Board[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        description: data.description || '', // 보드 설명
        isPrivate: data.isPrivate || false, // 보드 공개 여부
        ownerIds: Array.isArray(data.ownerId) ? data.ownerId : [], // 소유자 ID 배열
        pins: {
          pinId: Array.isArray(data.pins?.pinId) ? data.pins.pinId : [], // 핀 ID 배열
        },
        title: data.title || 'Untitled Board', // 보드 제목
        icon: data.icon || 'https://via.placeholder.com/30', // 보드 아이콘 URL
      };
    });

    return boards;
  } catch (error) {
    console.error('Error fetching boards:', error);
    return [];
  }
};
