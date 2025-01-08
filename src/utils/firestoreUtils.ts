import {
  addDoc,
  collection,
  doc,
  updateDoc,
  arrayUnion,
} from 'firebase/firestore';
import { db } from '../firebase';

export const addPinToFirestore = async (pinData: any) => {
  const docRef = await addDoc(collection(db, 'pins'), pinData);
  console.log('Document written with ID:', docRef.id);
  return docRef.id;
};

export const addCommentToFirestore = (newComment: any) => {
  const commentsRef = collection(db, 'comment'); // 'comment' 컬렉션 참조
  return addDoc(commentsRef, newComment); // Firestore에 새 댓글 추가
};

export const addPinToBoard = async (
  boardId: string,
  pinId: string,
): Promise<void> => {
  if (!boardId || !pinId) {
    console.error('Board ID or Pin ID is missing');
    return;
  }

  try {
    const boardRef = doc(db, 'boards', boardId); // Access the board document
    await updateDoc(boardRef, {
      pins: arrayUnion(pinId), // Add the pin ID to the pins array
    });

    console.log(`Pin ID: ${pinId} added to Board ID: ${boardId}`);
  } catch (error) {
    console.error('Error adding pin to board:', error);
  }
};
