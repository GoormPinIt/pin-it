import React, { ChangeEvent } from 'react';

interface InputFieldProps {
    label: string;
    placeholder: string;
    type?: string;
    textarea?: boolean;
    disabled?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    value?: string;
}

const InputField: React.FC<InputFieldProps> = ({
    label,
    placeholder,
    type = 'text',
    textarea = false,
    disabled = false,
    onChange,
    value,
}) => {
    return (
        <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">{label}</label>

            {textarea ? (
                <textarea
                    className={`w-full px-4 py-3 border font-normal rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        disabled ? 'bg-gray-100' : ''
                    }`}
                    placeholder={placeholder}
                    rows={4}
                    disabled={disabled}
                    onChange={onChange}
                    value={value}
                />
            ) : (
                <input
                    type={type}
                    className={`w-full px-4 py-3 border font-normal rounded-xl text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        disabled ? 'bg-gray-100' : ''
                    }`}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={onChange}
                    value={value}
                />
            )}
        </div>
    );
};

export default InputField;
