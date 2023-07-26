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
      <div className={`toggle-button${isOn ? ' -on' : ''}`}>
        <span role='button' className={`icon${isOn ? ' -on' : ''}`} onClick={onToggle}></span>
      </div>
    </div>
  );
};
