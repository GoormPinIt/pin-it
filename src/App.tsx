import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Home from './pages/Home';
import Login from './pages/Login';
import Mypage from './pages/Mypage';
import UserProfile from './pages/UserProfilePage';
import BoardDetails from './pages/BoardDetails';
import SignUp from './pages/Signup';
import Sidebar from './components/NavBar';
import ProfileBoardDetail from './pages/ProfileBoardDetail';
import Header from './components/Header';

const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <div className="flex">
          <Sidebar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/profile/:userId" element={<UserProfile />} />
            <Route path="/board/:boardId" element={<BoardDetails />} />
            <Route path="/boardDetail" element={<ProfileBoardDetail />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
