import React, { ChangeEvent } from 'react';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  textarea?: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  value?: string;
  onClick?: () => void; // 추가: onClick 이벤트
  onFocus?: () => void; // 추가: onFocus 이벤트
  onBlur?: () => void; // 추가: onBlur 이벤트
  readOnly?: boolean; // 추가: readOnly 속성
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = 'text',
  textarea = false,
  disabled = false,
  onChange,
  value,
  onClick,
  onFocus,
  onBlur,
  readOnly = false, // 기본값 추가
  className = 'mb-6',
}) => {
  return (
    <div className={`${className}`}>
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>

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
          onClick={onClick}
          onFocus={onFocus}
          onBlur={onBlur}
          readOnly={readOnly}
        />
      )}
    </div>
  );
};

export default InputField;
