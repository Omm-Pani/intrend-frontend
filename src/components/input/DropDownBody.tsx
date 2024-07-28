import CheckboxInput from './checkBoxInput';

interface DropDownProps {
  list: string[];
  selected?: string[];
  // setSelected: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function DropDown({ list, selected }: DropDownProps) {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Destructuring
    const { value, checked } = e.target;
    const selections = selected;
    console.log(value, checked);
    console.log(selections);
    // Case 1 : The user checks the box
    // if (checked) {
    //   setSelected([...selections, value]);
    // } else {
    //   setSelected(selected.filter((e) => e !== value));
    // }
  };
  return (
    <div>
      <div className="z-10 w-full bg-white rounded-lg absolute shadow dark:bg-gray-700">
        <ul
          className="px-3 py-2 overflow-y-auto text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownSearchButton"
        >
          {list.map((list, key) => (
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
  );
}
