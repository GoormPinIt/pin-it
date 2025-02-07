import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Face, KeyboardArrowDown } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from 'firebase/auth';
import { logout } from '../features/authSlice';
import { auth } from '../firebase';
import { RootState } from '../store';
import useCurrentUserUid from '../hooks/useCurrentUserUid';
import { toast, ToastContainer } from 'react-toastify';

// import SearchModal from './SearchModal';

const Header: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [isActive, setIsActive] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const currentUserUid = useCurrentUserUid();
  // const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const onSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const toggleActive = () => {
    setIsActive(!isActive);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      dispatch(logout());
      setIsActive(false);
      toast.success('로그아웃되었습니다.');
    } catch (error) {
      console.error('로그아웃 실패');
      toast.error('로그아웃에 실패했습니다.');
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // const modalRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       modalRef.current &&
  //       !modalRef.current.contains(event.target as Node)
  //     ) {
  //       setIsSearchModalOpen(false);
  //     }
  //   };

  //   document.addEventListener('mousedown', handleClickOutside);
  //   return () => {
  //     document.removeEventListener('mousedown', handleClickOutside);
  //   };
  // }, []);

  return (
    <div className="fixed top-0 left-14 right-0 flex items-center justify-between p-4 bg-white z-50">
      <div className="flex-1 mx-4">
        {/* <div className="relative" ref={modalRef}> */}
        <div>
          {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
          <form onSubmit={onSearchSubmit} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 bg-btn_h_gray"
                placeholder="검색"
                // onClick={() => setIsSearchModalOpen(true)}
                onChange={(e) => setInput(e.target.value)}
                value={input}
              />
            </div>
            <button type="submit" className="hidden"></button>
          </form>

          {/* <SearchModal
            isOpen={isSearchModalOpen}
            onClose={() => setIsSearchModalOpen(false)}
          /> */}
        </div>
      </div>
      <div className="flex items-center">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => navigate(`/profile/${currentUserUid}`)}
              className="mx-2"
            >
              <Face className="text-gray-700" />
            </button>
            <div className="relative">
              <button onClick={toggleActive} className="mx-2">
                <KeyboardArrowDown className="text-gray-700" />
              </button>
              {isActive && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <button
                    onClick={() => {
                      navigate(`/profile/${currentUserUid}`);
                      setIsActive(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    프로필
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="mx-2 px-4 py-2 text-sm text-white bg-btn_red rounded-3xl hover:bg-btn_h_red"
          >
            로그인
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
