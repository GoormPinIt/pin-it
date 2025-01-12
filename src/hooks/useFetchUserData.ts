import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase'; // Firebase 설정 파일 경로 확인

interface User {
  id: string;
  name: string;
  profileImage: string;
}

const useFetchUserData = (
  uid: string,
): { user: User | null; loading: boolean; error: string | null } => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) return;

    const fetchUserData = async () => {
      setLoading(true);
      try {
        const userDocRef = doc(db, 'users', uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const { id, name, profileImage } = userDoc.data();
          setUser({ id, name, profileImage });
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to fetch user data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [uid]);

  return { user, loading, error };
};

export default useFetchUserData;
