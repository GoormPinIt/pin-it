import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const useCurrentUserUid = (): string | null => {
  const [currentUserUid, setCurrentUserUid] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUid(user.uid);
      } else {
        setCurrentUserUid(null);
      }
    });

    return () => unsubscribe(); // 컴포넌트 언마운트 시 리스너 정리
  }, []);

  return currentUserUid;
};

export default useCurrentUserUid;
