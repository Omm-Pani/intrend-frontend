// components/input/themed-input.tsx
import React from 'react';

interface ThemedInputProps {
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ThemedInput({
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
}: ThemedInputProps) {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm
          focus:border-transparent focus:ring-2 focus:ring-primary focus:outline-none
          transition-all duration-200 ease-in-out
          hover:shadow-md"
      />
    </div>
  );
}
