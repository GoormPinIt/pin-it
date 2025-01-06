import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [profileImage, setProfileImage] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`회원가입 실패: ${error.message}`);
      } else {
        alert('회원가입 실패: 알 수 없는 오류가 발생했습니다.');
      }
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
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-3xl focus:outline-none focus:ring-1"
              required
            />
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
            className="w-full px-4 py-2 mt-4 text-white bg-btn_red rounded-3xl hover:bg-btn_h_red"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
