import React from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import EditProfile from '../components/EditProfile';

const Settings = (): JSX.Element => {
  return (
    <div className="flex p-6 gap-4 w-full">
      <nav className="flex flex-col mb-4 w-28">
        <NavLink
          to="/settings/edit-profile"
          className={({ isActive }) =>
            `p-2 text-base rounded-md hover:bg-gray-100 ${
              isActive
                ? 'font-bold underline underline-offset-8 decoration-4'
                : 'font-medium'
            }`
          }
        >
          프로필 수정
        </NavLink>
        <NavLink
          to="/settings/account-management"
          className={({ isActive }) =>
            `p-2 text-base rounded-md hover:bg-gray-100 ${
              isActive
                ? 'font-bold underline underline-offset-8 decoration-4'
                : 'font-medium'
            }`
          }
        >
          계정 관리
        </NavLink>
      </nav>
      <Routes>
        <Route path="edit-profile" element={<EditProfile />} />
        <Route
          path="account-management"
          element={<div>계정 관리 페이지</div>}
        />
        <Route path="*" element={<Navigate to="edit-profile" />} />
      </Routes>
    </div>
  );
};

export default Settings;
