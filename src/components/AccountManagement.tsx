import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { auth } from '../firebase';
import { FirebaseError } from 'firebase/app'; // FirebaseError 임포트
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  deleteUser,
} from 'firebase/auth';
import { RootState } from '../store';

const AccountManagement: React.FC = () => {
  const userEmail = useSelector(
    (state: RootState) => state.auth.userData?.email,
  );
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [deleteAccountPassword, setDeleteAccountPassword] = useState('');

  const user = useSelector((state: RootState) => state.auth.userData);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser || !user) return;

    // 새 비밀번호와 확인 비밀번호 비교
    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    // 현재 비밀번호와 새 비밀번호 비교
    if (currentPassword === newPassword) {
      alert('현재 비밀번호와 새 비밀번호는 같을 수 없습니다.');
      return;
    }

    try {
      // 현재 비밀번호로 재인증
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword,
      );
      await reauthenticateWithCredential(auth.currentUser, credential); // 재인증

      // 재인증 성공 후 비밀번호 변경
      await updatePassword(auth.currentUser, newPassword);
      alert('비밀번호가 성공적으로 변경되었습니다.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);

      // 에러 처리
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/wrong-password') {
          alert('현재 비밀번호가 올바르지 않습니다.');
        } else {
          alert('비밀번호 변경에 실패했습니다: ' + error.message);
        }
      } else {
        alert('알 수 없는 오류가 발생했습니다.');
      }
    }
  };

  const handleAccountDelete = async () => {
    const user = auth.currentUser;

    if (!user) {
      console.error('사용자가 로그인되어 있지 않습니다.');
      alert('로그인 상태가 아닙니다.');
      return;
    }

    // 사용자 재인증
    const credential = EmailAuthProvider.credential(
      user.email!,
      deleteAccountPassword,
    );

    try {
      await reauthenticateWithCredential(user, credential); // 재인증
      await deleteUser(user); // 계정 삭제
      console.log('계정이 성공적으로 삭제되었습니다.');
      alert('계정이 성공적으로 삭제되었습니다.');
    } catch (error) {
      // 에러 처리
      if (error instanceof FirebaseError) {
        if (error.code === 'auth/wrong-password') {
          alert('입력한 비밀번호가 올바르지 않습니다.');
        } else {
          alert('계정 삭제에 실패했습니다: ' + error.message);
        }
      } else {
        alert('계정 삭제 중 알 수 없는 오류가 발생했습니다.');
      }
      console.error('계정 삭제 실패:', error);
    }
  };

  return (
    <div className="w-[488px]">
      <h2 className="text-3xl font-semibold mb-2">계정 관리 페이지</h2>
      <p className="mb-6">개인 정보 또는 계정 유형을 변경합니다.</p>
      <form className="mt-10 mb-10">
        <h3 className="text-xl mb-2 font-semibold text-gray-800 ">내 계정</h3>
        <input
          type="email"
          value={userEmail || ''}
          readOnly
          className="w-full p-2 border-2 border-gray-300 rounded-xl"
        />
      </form>

      <form onSubmit={handlePasswordChange} className="mb-10">
        <h3 className="text-xl font-semibold mb-2">비밀번호 변경</h3>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="현재 비밀번호"
          className="w-full p-2 border-2 border-gray-300 rounded-xl my-2"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
          className="w-full p-2 border-2 border-gray-300 rounded-xl my-2"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="새 비밀번호 확인"
          className="w-full p-2 border-2 border-gray-300 rounded-xl my-2"
          required
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 font-medium rounded-full hover:bg-btn_h_gray bg-btn_gray"
          >
            변경
          </button>
        </div>
      </form>

      <div className="mb-10">
        <h3 className="text-xl mb-2 font-semibold text-gray-800">
          데이터 및 계정 삭제
        </h3>
        <p className="text-sm mb-2">
          데이터 및 계정과 관련된 모든 정보를 영구적으로 삭제합니다.
        </p>
        <input
          type="password"
          value={deleteAccountPassword}
          onChange={(e) => setDeleteAccountPassword(e.target.value)}
          placeholder="현재 비밀번호"
          className="w-full p-2 border-2 border-gray-300 rounded-xl my-2"
          required
        />
        <div className="flex justify-end">
          <button
            onClick={handleAccountDelete}
            className="px-4 py-2 font-medium text-white rounded-full hover:bg-btn_h_red bg-btn_red"
          >
            계정 삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
