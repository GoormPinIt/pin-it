import React from 'react';
import Form from '../components/Form';
import Sidebar from '../components/Sidebar';

const PinBuilder = () => {
    return (
        <div>
            <div className="flex items-center border-t border-b border-gray-200 fixed top-[80px] left-0 h-[81px] w-full z-[1] bg-white">
                <div className="w-[110px] inline-block"></div>
                <h1 className="inline-block text-xl font-semibold text-gray-900">핀 만들기</h1>
            </div>
            <Sidebar />

            <Form />
        </div>
    );
};

export default PinBuilder;
