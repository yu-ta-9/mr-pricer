import React from 'react';

type Props = {
  label: string;
  isOn: boolean;
  onToggle: () => void;
};

export const ToggleButton: React.FC<Props> = ({ label, isOn, onToggle }) => {
  return (
    <div className='flex items-center gap-4'>
      <p className='text-sm'>{label}</p>
      <div
        className={`relative inline-block w-11 h-6 rounded-xl transition-all ease-out duration-300 ${
          isOn ? 'bg-primary' : 'bg-base-secondary'
        }`}
      >
        <span
          role='button'
          className={`absolute bg-white top-1/2 left-0 flex items-center justify-center w-5 h-5 p-1 my-0 cursor-pointer rounded-full transition-all duration-300 ease-out mx-[2px] transform -translate-y-1/2 ${
            isOn ? 'translate-x-full' : 'translate-x-0'
          }`}
          onClick={onToggle}
        ></span>
      </div>
    </div>
  );
};
