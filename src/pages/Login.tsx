import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import logo from '../assets/pinit_logo.png';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { UserData } from '../features/authSlice';
import { toast } from 'react-toastify';

const getCurrentUserUid = () => {
  const user = auth.currentUser;
  if (user) {
    return user.uid;
  }
  return null;
};

console.log('현재 로그인한 UID:', getCurrentUserUid());

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        dispatch(
          loginSuccess({
            email: user.email || '',
            uid: user.uid,
          }),
        );
        toast.success('로그인 성공!');
        navigate('/');
      } else {
        console.error('유저 데이터가 존재하지 않습니다.');
        toast.error('사용자 정보를 찾을 수 없습니다.');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(`로그인 실패`);
      } else {
        toast.error('로그인 실패: 알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Redux 상태 업데이트
      dispatch(
        loginSuccess({
          email: user.email || '',
          uid: user.uid,
        }),
      );

      // 로그인 성공 후 처리 (예: 페이지 리다이렉트)
      toast.success('Google 로그인 성공!');
      navigate('/');
    } catch (error) {
      console.error('로그인 실패');
      toast.error('Google 로그인 실패');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen mx-auto my-0">
      <div className="w-96 rounded-3xl px-8 py-6 mt-4 text-left bg-white shadow-xl">
        <div className="flex justify-center mb-4">
          <img src={logo} alt="logo" className="w-12 h-12" />
        </div>
        <h3 className="text-2xl font-bold text-center">새 개인 계정 만들기</h3>
        <p className="mt-1 text-sm text-center text-gray-600">
          시도해 볼 만한 새로운 아이디어 찾기
        </p>
        <form onSubmit={handleLogin}>
          <div className="mt-4">
            <label className="block text-sm text-gray-600" htmlFor="email">
              이메일
            </label>
            <input
              type="email"
              id="email"
              placeholder="이메일"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-3xl focus:outline-none focus:ring-1"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-600" htmlFor="password">
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-3xl focus:outline-none focus:ring-1"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-4 text-white bg-btn_red rounded-3xl hover:bg-btn_h_red "
          >
            로그인
          </button>
        </form>
        <div>
          <button
            onClick={handleGoogleLogin}
            className="w-full px-4 py-2 mt-4 text-white bg-btn_gray rounded-3xl hover:bg-btn_h_gray"
          >
            Google로 로그인
          </button>
        </div>
        <div className="text-center mt-4">
          <span>계정이 없으신가요? </span>
          <Link to="/signup" className="text-t2_red hover:underline">
            회원가입
          </Link>
        </div>
        <p className="text-xs text-center text-gray-600 mt-4">
          계속 진행하면 Pinit 서비스 약관에 동의하고 개인정보처리방침을 읽었음을
          인정하는 것으로 간주됩니다. 컬렉션 알림.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
