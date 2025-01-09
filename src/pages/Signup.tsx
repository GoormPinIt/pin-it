import React, { useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
} from 'firebase/firestore';
import useDebounce from '../hooks/useDebounce';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [idStatus, setIdStatus] = useState<
    'initial' | 'available' | 'unavailable'
  >('initial');

  const navigate = useNavigate();
  const debouncedId = useDebounce(id, 500);

  useEffect(() => {
    const checkIdAvailability = async () => {
      if (debouncedId) {
        const q = query(
          collection(db, 'users'),
          where('id', '==', debouncedId),
        );
        const querySnapshot = await getDocs(q);
        setIdStatus(querySnapshot.empty ? 'available' : 'unavailable');
      } else {
        setIdStatus('initial');
      }
    };
    checkIdAvailability();
  }, [debouncedId]);

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (idStatus !== 'available') {
      alert('사용할 수 없는 아이디입니다.');
      return;
    }

    try {
      const signInMethods = await fetchSignInMethodsForEmail(auth, email);
      if (signInMethods.length > 0) {
        alert('이미 사용 중인 이메일입니다.');
        return;
      }

      setLoading(true);

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Firestore에 사용자 정보 저장
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        uid: user.uid,
        createdAt: new Date(),
        id: id,
        name: name,
        profileImage: profileImage,
        followers: [],
        following: [],
        createdPins: [],
        savedPins: [],
        createdBoards: [],
      });

      console.log('회원가입 성공:', user);
      alert('회원가입 성공!');
      navigate('/login');
    } catch (error) {
      console.error('회원가입 실패:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
        alert(`회원가입 실패: ${error.message}`);
      } else {
        alert('회원가입 실패: 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mx-auto my-0">
      <div className="w-96 rounded-3xl px-8 py-6 mt-4 text-left bg-white shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-4">회원가입</h2>
        <form onSubmit={handleSignUp}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-3xl focus:outline-none focus:ring-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">아이디</label>
            <input
              type="text"
              value={id}
              onChange={handleIdChange}
              className={`w-full px-4 py-2 mt-2 border rounded-3xl focus:outline-none focus:ring-1 ${
                idStatus === 'unavailable'
                  ? 'border-red-500'
                  : idStatus === 'available'
                    ? 'border-green-500'
                    : ''
              }`}
              required
            />
            {idStatus !== 'initial' && (
              <p
                className={`text-sm mt-1 ${idStatus === 'available' ? 'text-green-500' : 'text-red-500'}`}
              >
                {idStatus === 'available'
                  ? '사용 가능한 아이디입니다.'
                  : '이미 사용 중인 아이디입니다.'}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">닉네임</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-3xl focus:outline-none focus:ring-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">비밀번호</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-3xl focus:outline-none focus:ring-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm text-gray-600">비밀번호 확인</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-3xl focus:outline-none focus:ring-1"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || idStatus !== 'available'}
            className={`w-full px-4 py-2 mt-4 text-white ${
              loading ? 'bg-gray-400' : 'bg-btn_red'
            } rounded hover:bg-btn_h_red`}
          >
            {loading ? '로딩 중...' : '회원가입'}
          </button>
          {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default SignUp;
