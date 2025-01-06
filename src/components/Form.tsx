import React from 'react';
import UploadImage from './UploadImage';
import UserTag from './UserTag';

const Form: React.FC = () => {
    return (
        <div className="bg-white rounded-2xl ">
            <UploadImage />
        </div>
    );
};

export default Form;

// grid grid-cols-1 lg:grid-cols-3 gap-10
