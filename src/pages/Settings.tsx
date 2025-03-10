import React from 'react';
import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import EditProfile from '../components/EditProfile';
import AccountManagement from '../components/AccountManagement';

const Settings = (): JSX.Element => {
  return (
    <div className="flex p-6 gap-4 w-full justify-between">
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
        <Route path="account-management" element={<AccountManagement />} />
        <Route path="*" element={<Navigate to="edit-profile" />} />
      </Routes>
      <div className="w-28"></div>
    </div>
  );
};

export default Settings;
