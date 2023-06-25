import { forwardRef } from 'react';

type Props = {
  label?: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
  fullWidth?: boolean;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, placeholder, options, fullWidth, ...selectProps }, ref) => {
    return (
      <label className={`${fullWidth ? 'w-full' : ''}`}>
        {label !== undefined && <span className='text-sm'>{label}</span>}

        <select
          {...selectProps}
          ref={ref}
          className='block w-full mt-1 text-sm bg-white rounded-md shadow-sm color-base-primary border-base-primary focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50'
          placeholder={placeholder}
        >
          {options.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    );
  },
);

Select.displayName = 'Select';
