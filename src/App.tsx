import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Mypage from "./pages/Mypage";
import BoardDetails from "./pages/BoardDetails";
import SignUp from "./pages/Signup";
import Sidebar from "./components/NavBar";
import ProfileBoardDetail from "./pages/ProfileBoardDetail";


const App = (): JSX.Element => {

  return (
    <Provider store={store}>
      <Router>
        <div className="flex">
          <Sidebar />

          <div className="flex-1 ml-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/mypage" element={<Mypage />} />
              <Route path="/boardDetail" element={<ProfileBoardDetail />} />
              <Route path="/board/:boardId" element={<BoardDetails />} />
            </Routes>
          </div>
        </div>
      </Router>
    </Provider>
  );
};

export default App;
