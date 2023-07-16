import { forwardRef } from 'react';

type Props = {
  label?: string;
  placeholder?: string;
  options: { value: string | number; label: string }[];
  fullWidth?: boolean;
  error?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = forwardRef<HTMLSelectElement, Props>(
  ({ label, placeholder, options, fullWidth, error, ...selectProps }, ref) => {
    const isError = error !== undefined && error !== '';

    return (
      <label className={`${fullWidth ? 'w-full' : ''}`}>
        {label !== undefined && <span className='text-sm'>{label}</span>}

        <select
          {...selectProps}
          ref={ref}
          className={
            'block w-full mt-1 text-sm bg-white rounded-md shadow-sm color-base-primary border-base-primary focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50' +
            (isError && ' border-danger')
          }
          placeholder={placeholder}
        >
          {options.map((option, i) => (
            <option key={i} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {isError ? <span className='text-sm text-danger'>{error}</span> : null}
      </label>
    );
  },
);

Select.displayName = 'Select';
