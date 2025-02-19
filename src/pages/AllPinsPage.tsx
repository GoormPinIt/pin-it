import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MasonryLayout from '../components/MasonryLayout';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Pin from '../components/Pin';

const AllPinsPage = (): JSX.Element => {
  const { uid } = useParams<{ uid: string }>();
  const [allPins, setAllPins] = useState<{ pinId: string; imageUrl: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchAllPins = async () => {
      if (!uid) return;

      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
          console.error('사용자 데이터를 찾을 수 없습니다.');
          return;
        }

        const { createdPins = [], savedPins = [] } = userDoc.data();
        const allPinIds = [...new Set([...createdPins, ...savedPins])];

        const pinData = await Promise.all(
          allPinIds.map(async (pinId: string) => {
            const pinDocRef = doc(db, 'pins', pinId);
            const pinDoc = await getDoc(pinDocRef);

            if (pinDoc.exists()) {
              return { pinId: pinId, imageUrl: pinDoc.data().imageUrl };
            }
            return null;
          }),
        );

        setAllPins(
          pinData.filter(
            (pin): pin is { pinId: string; imageUrl: string } => pin !== null,
          ),
        );
      } catch (error) {
        console.error('핀 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchAllPins();
  }, [uid]);

  return (
    <div className="p-4">
      <p className="text-center text-xl font-semibold mb-4">모든 핀</p>
      <MasonryLayout
        pins={allPins.map((pin) => (
          <Pin key={pin.pinId} id={pin.pinId} src={pin.imageUrl} />
        ))}
      />
    </div>
  );
};

export default AllPinsPage;
