import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loginSuccess, logout } from './features/authSlice';
import Home from './pages/Home';
import Login from './pages/Login';
import UserProfile from './pages/UserProfilePage';
import BoardDetails from './pages/BoardDetails';
import SignUp from './pages/Signup';
import Header from './components/Header';
import NavBar from './components/NavBar';
import ProfileBoardDetail from './pages/ProfileBoardDetail';
import PinBuilder from './pages/PinBuilder';
import PinPage from './pages/PinPage';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';
import AllPinsPage from './pages/AllPinsPage';
import PhotoEditPage from './pages/PhotoEditPage';

const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App;

const AppRoutes = (): JSX.Element => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const auth = getAuth();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          email: user.email || '',
          uid: user.uid || '',
        };
        dispatch(loginSuccess(userData));
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch, auth]);

  return (
    <>
      <Header />
      {isLoggedIn ? (
        <div className="flex pt-16">
          <NavBar />
          <div className="flex-1 pl-16">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profile/:userId" element={<UserProfile />} />
              <Route path="/profile/:uid/all-pins" element={<AllPinsPage />} />
              <Route path="/board/:boardId" element={<BoardDetails />} />
              <Route path="/boardDetail" element={<ProfileBoardDetail />} />
              <Route path="/pin-creation-tool" element={<PinBuilder />} />
              <Route path="/pin/:pinId" element={<PinPage />} />
              <Route path="/photo_edit" element={<PhotoEditPage />} />
              <Route path="/settings/*" element={<Settings />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      )}
    </>
  );
};
