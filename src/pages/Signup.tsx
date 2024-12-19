import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    // 비밀번호 일치 확인
    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // Firebase 회원가입 메서드
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("회원가입 성공:", user);
      alert("회원가입 성공!");
      navigate("/login"); // 로그인 페이지로 이동
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`로그인 실패: ${error.message}`);
      } else {
        alert("로그인 실패: 알 수 없는 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
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
            className="w-full px-4 py-2 mt-4 text-white bg-red-600 rounded-3xl hover:bg-red-700"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
