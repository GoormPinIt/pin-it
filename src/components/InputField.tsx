import React from 'react';

interface InputFieldProps {
    label: string; // 입력 필드의 레이블
    placeholder: string; // 입력 필드의 플레이스홀더
    type?: string; // 입력 타입 (기본값: "text")
    textarea?: boolean; // 텍스트 영역인지 여부
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, type = 'text', textarea = false }) => {
    return (
        <div className="mb-6">
            {/* 레이블 */}
            <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>

            {/* 입력 필드 */}
            {textarea ? (
                <textarea
                    className="w-full px-4 py-3 border font-normal  rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={placeholder}
                    rows={4} // 텍스트 영역의 높이
                />
            ) : (
                <input
                    type={type}
                    className="w-full px-4 py-3 border font-normal rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={placeholder}
                />
            )}
        </div>
    );
};

export default InputField;
