import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

export const addPinToFirestore = async (pinData: any) => {
  const docRef = await addDoc(collection(db, 'pins'), pinData);
  console.log('Document written with ID:', docRef.id);
  return docRef.id;
};
