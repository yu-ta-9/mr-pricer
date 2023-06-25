import { forwardRef } from 'react';

type Props = {
  label?: string;
  placeholder?: string;
  fullWidth?: boolean;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, placeholder, fullWidth, ...textareaProps }, ref) => {
    return (
      <label className={`${fullWidth ? 'w-full' : ''}`}>
        {label !== undefined && <span className='text-sm'>{label}</span>}
        <textarea
          {...textareaProps}
          ref={ref}
          className='block w-full mt-1 text-sm rounded-md shadow-sm color-base-primary border-base-primary focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50'
          placeholder={placeholder}
        />
      </label>
    );
  },
);

Textarea.displayName = 'Textarea';
