import type { FC } from 'react';

type Props = {
  label: string;
  options: { label: string; value: string | number }[];
  name: string;
  value?: string | number;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  error?: string;
};

export const RadioGroup: FC<Props> = ({ label, options, name, value, onChange, fullWidth, error }) => {
  const isError = error !== undefined && error !== '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label !== undefined && <span className='text-sm'>{label}</span>}

      <div className='flex mt-1'>
        {options.map((option, i) => (
          <div key={option.value} className='flex items-center mr-4'>
            <input
              id={`${name}-${i}`}
              type='radio'
              value={option.value}
              name={name}
              onChange={(e) => onChange(e.target.value)}
              checked={option.value === value}
              className='w-4 h-4 cursor-pointer text-primary bg-base-secondary border-base-secondary focus:ring-primary'
            />
            <label htmlFor={`${name}-${i}`} className='ml-2 text-sm text-black cursor-pointer'>
              {option.label}
            </label>
          </div>
        ))}
      </div>

      {isError ? <span className='text-sm text-danger'>{error}</span> : null}
    </div>
  );
};
