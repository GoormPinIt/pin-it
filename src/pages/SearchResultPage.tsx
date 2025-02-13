import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  startAt,
  endAt,
} from 'firebase/firestore';
import { db } from '../firebase';
import MasonryLayout from '../components/MasonryLayout';
import Pin from '../components/Pin';

const SearchResultsPage: React.FC = () => {
  const [pins, setPins] = useState<{ pinId: string; imageUrl: string }[]>([]);
  const location = useLocation();

  useEffect(() => {
    const fetchPins = async () => {
      const searchParams = new URLSearchParams(location.search);
      const queryParam = searchParams.get('query');

      if (!queryParam) return;

      try {
        const pinsRef = collection(db, 'pins');
        // 접두사 검색 쿼리
        const prefixQuery = query(
          pinsRef,
          orderBy('title'),
          startAt(queryParam),
          endAt(queryParam + '\uf8ff'),
        );

        // 포함 검색 쿼리
        const containsQuery = query(
          pinsRef,
          where('keywords', 'array-contains', queryParam),
        );

        // 접두사 검색 결과
        const prefixSnapshot = await getDocs(prefixQuery);
        const prefixResults = prefixSnapshot.docs.map((doc) => ({
          pinId: doc.id,
          imageUrl: doc.data().imageUrl,
          title: doc.data().title,
        }));

        // 포함 검색 결과
        const containsSnapshot = await getDocs(containsQuery);
        const containsResults = containsSnapshot.docs.map((doc) => ({
          pinId: doc.id,
          imageUrl: doc.data().imageUrl,
          title: doc.data().title,
        }));

        // 중복 제거 후 통합
        const allResults = [
          ...prefixResults,
          ...containsResults.filter(
            (containsPin) =>
              !prefixResults.some(
                (prefixPin) => prefixPin.pinId === containsPin.pinId,
              ),
          ),
        ];

        setPins(allResults);
      } catch (error) {
        console.error('핀 데이터를 가져오는 중 오류 발생:', error);
      }
    };

    fetchPins();
  }, [location]);

  return (
    <div
      className="pl-4 pr-4 h-screen overflow-y-auto"
      style={{ height: 'calc(100vh - 64px)', paddingTop: '64px' }}
    >
      {/* 검색된 핀들을 MasonryLayout으로 표시 */}
      <MasonryLayout
        pins={pins.map((pin) => (
          <div key={pin.pinId} style={{ marginBottom: '16px' }}>
            {' '}
            {/* 여기에 marginBottom 추가 */}
            <Pin id={pin.pinId} src={pin.imageUrl} />
          </div>
        ))}
      />
    </div>
  );
};

export default SearchResultsPage;
