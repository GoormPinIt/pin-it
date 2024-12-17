import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Mypage from './pages/Mypage';
import PinBuilder from './pages/PinBuilder';

const App = (): JSX.Element => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/pin-creation-tool" element={<PinBuilder />} />
            </Routes>
        </Router>
    );
};

export default App;
