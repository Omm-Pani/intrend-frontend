import React from 'react';

interface CheckBoxInputProps {
  name: string;
  id: string;
  key: number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function CheckboxInput({
  name,
  id,
  key,
  onChange,
}: CheckBoxInputProps) {
  return (
    <li id={id} key={key}>
      <div>
        <input
          id={`checkbox-item-${id}`}
          type="checkbox"
          value={name}
          onChange={onChange}
        />
        <label
          htmlFor={`checkbox-item-${id}`}
          className="w-full ms-2 text-sm font-medium text-gray-900 rounded dark:text-gray-300"
        >
          {name}
        </label>
      </div>
    </li>
  );
}
