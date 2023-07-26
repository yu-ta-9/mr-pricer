import { forwardRef } from 'react';
import ReactSelect from 'react-select';

import { customStyles } from '@/components/ui/SelectMulti/customStyles';

import type { ComponentProps } from 'react';

type SelectOption = { value: string | number; label: string };

type Props = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  fullWidth?: boolean;
  error?: string;
  onOptionChange: (newValue: SelectOption[]) => void;
} & ComponentProps<typeof ReactSelect>;

export const SelectMulti = forwardRef<HTMLDivElement, Props>(
  ({ id, label, placeholder, options, fullWidth, error, onOptionChange, ...selectProps }, ref) => {
    const isError = error !== undefined && error !== '';

    return (
      <div ref={ref} role='group' className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label !== undefined && (
          <label className='text-sm' htmlFor={id}>
            {label}
          </label>
        )}

        <ReactSelect
          {...selectProps}
          styles={customStyles(isError)}
          isMulti
          options={options}
          placeholder={placeholder}
          onChange={(newValue) => onOptionChange(newValue as SelectOption[])}
        />

        {isError ? <span className='text-sm text-danger'>{error}</span> : null}
      </div>
    );
  },
);

SelectMulti.displayName = 'SelectMulti';
