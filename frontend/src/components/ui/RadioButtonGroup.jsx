import React from 'react';

const RadioButtonGroup = ({ options, selectedOption, onOptionChange }) => {
  return (
    <div className="relative flex flex-wrap rounded-[1rem] bg-[#EEE] w-[300px] text-[14px] shadow-[0_0_0px_1px_rgba(0,0,0,0.06)]">
      {options.map((option) => (
        <label key={option} className="radio flex-1 text-center">
          <input
            type="radio"
            name="radio"
            value={option}
            checked={selectedOption === option}
            onChange={onOptionChange}
            className="hidden"
          />
          <span
            className={`name flex cursor-pointer items-center justify-center rounded-[0.5rem] p-2 text-[rgba(51,65,85,1)] transition-all duration-150 ease-in-out ${
              selectedOption === option ? 'bg-white font-semibold' : ''
            }`}
          >
            {option}
          </span>
        </label>
      ))}
    </div>
  );
};

export default RadioButtonGroup;