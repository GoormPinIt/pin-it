import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { RootState, store } from './store';
import Home from './pages/Home';
import Login from './pages/Login';
import Mypage from './pages/Mypage';
import BoardDetails from './pages/BoardDetails';
import SignUp from './pages/Signup';
import Sidebar from './components/NavBar';
import ProfileBoardDetail from './pages/ProfileBoardDetail';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { loginSuccess, logout } from './features/authSlice';

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
        dispatch(loginSuccess(user.email || ''));
      } else {
        dispatch(logout());
      }
    });
  }, []);

  return isLoggedIn ? (
    <>
      <Header />
      <div className="flex">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/board/:boardId" element={<BoardDetails />} />
          <Route path="/boardDetail" element={<ProfileBoardDetail />} />
        </Routes>
      </div>
    </>
  ) : (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
};
