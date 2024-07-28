import { ChangeEvent, useState } from 'react';
interface inputBoxType {
  label: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  value: string[];
  list: string[];
  selected?: string[];
}

import CheckboxInput from './checkBoxInput';
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';

export default function DropDownInputBox({
  placeholder,
  label,
  onChange,
  value,
  list,
}: inputBoxType) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text text-xs text-base-content text-white">
            {label}
          </span>
        </label>
        <div className="dropdown">
          <input
            type="text"
            onClick={() => setIsExpanded(!isExpanded)}
            placeholder={placeholder}
            value={value}
            className="input input-bordered w-full"
          />
          <ChevronDownIcon
            className={`absolute right-0 top-2.5 mr-2 w-5 h-5 mt-1 delay-400 duration-500 transition-all ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow"
          >
            {isExpanded &&
              list.map((list, key) => (
                <CheckboxInput
                  name={list}
                  key={key}
                  id={`${key}`}
                  onChange={onChange}
                />
              ))}
          </ul>
        </div>
      </div>
    </>
  );
}
