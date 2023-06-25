import { forwardRef } from 'react';

type Props = {
  label?: string;
  placeholder?: string;
  type: 'text' | 'number' | 'url';
  fullWidth?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, type, placeholder, fullWidth, ...inputProps }, ref) => {
    return (
      <label className={`${fullWidth ? 'w-full' : ''}`}>
        {label !== undefined && <span className='text-sm'>{label}</span>}
        <input
          {...inputProps}
          ref={ref}
          className='block w-full mt-1 text-sm rounded-md shadow-sm color-base-primary border-base-primary focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50'
          type={type}
          placeholder={placeholder}
        />
      </label>
    );
  },
);

Input.displayName = 'Input';
