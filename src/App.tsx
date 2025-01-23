import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState, store } from './store';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { initializeAuth, loginSuccess, logout } from './features/authSlice';
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
import StoryPage from './pages/StoryPage';
import CreateStory from './pages/CreateStory';
import PhotoEditPage from './pages/PhotoEditPage';
import OrganizePins from './pages/OrganizePins';
import ScrollTop from './components/ScrollTop';
import loadingCircle from './assets/loading.gif';

const auth = getAuth();

const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Router>
        <ScrollTop />
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App;

const AppRoutes = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn, initialized } = useSelector(
    (state: RootState) => state.auth,
  );

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <img src={loadingCircle} alt="로딩 중..." className="w-12" />
      </div>
    );
  }

  return (
    <>
      <Header />
      {initialized &&
        (isLoggedIn ? (
          <div className="flex pt-16">
            <NavBar />
            <div className="flex-1 pl-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profile/:userId" element={<UserProfile />} />
                <Route
                  path="/profile/:uid/all-pins"
                  element={<AllPinsPage />}
                />
                <Route path="/board/:boardId" element={<BoardDetails />} />
                <Route
                  path="/board/:boardId/organize"
                  element={<OrganizePins />}
                />
                <Route
                  path="/board/:boardId/organize"
                  element={<OrganizePins />}
                />
                <Route path="/boardDetail" element={<ProfileBoardDetail />} />
                <Route path="/pin-creation-tool" element={<PinBuilder />} />
                <Route path="/pin/:pinId" element={<PinPage />} />
                <Route path="/photo_edit" element={<PhotoEditPage />} />
                <Route path="/settings/*" element={<Settings />} />
                <Route
                  path="/story/:userUid/:storyId"
                  element={<StoryPage />}
                />
                <Route path="/create-story" element={<CreateStory />} />
              </Routes>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        ))}
    </>
  );
};
