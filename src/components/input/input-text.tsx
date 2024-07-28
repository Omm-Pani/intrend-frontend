import React, { useState } from 'react';

interface InputTextProps {
  labelTitle: string;
  labelStyle?: string;
  type?: string;
  containerStyle?: string;
  defaultValue?: string;
  placeholder?: string;
  updateFormValue: (updateType: string, value: string) => void; // Updated function signature
  updateType: string;
}

function InputText({
  labelTitle,
  labelStyle,
  type,
  containerStyle,
  defaultValue,
  placeholder,
  updateFormValue,
  updateType,
}: InputTextProps): JSX.Element {
  const [value, setValue] = useState<string>(defaultValue || '');

  const updateInputValue = (val: string): void => {
    setValue(val);
    updateFormValue(updateType, val); // Pass both updateType and value
  };

  return (
    <div className={`form-control w-full ${containerStyle}`}>
      <label className="label">
        <span className={'text-sm text-white' + (labelStyle || '')}>
          {labelTitle}
        </span>
      </label>
      <input
        type={type || 'text'}
        value={value}
        placeholder={placeholder || ''}
        onChange={(e) => updateInputValue(e.target.value)}
        className="input border border-gray-500 w-full"
      />
    </div>
  );
}

export default InputText;
