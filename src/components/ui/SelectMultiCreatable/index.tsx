import { forwardRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';

import { customStyles } from '@/components/ui/SelectMulti/customStyles';

import type { ReactSelectOption } from '../../../../types/react-select';
import type { ComponentProps } from 'react';

type Props = {
  label?: string;
  placeholder?: string;
  options: ReactSelectOption[];
  onCreate: (inputValue: string) => Promise<void>;
  fullWidth?: boolean;
  error?: string;
  onOptionChange: (newValue: ReactSelectOption[]) => void;
} & ComponentProps<typeof CreatableSelect>;

export const SelectMultiCreatable = forwardRef<HTMLDivElement, Props>(
  ({ id, label, placeholder, options, onCreate, fullWidth, error, onOptionChange, ...selectProps }, ref) => {
    const [isLoading, setIsLoading] = useState(false);

    const isError = error !== undefined && error !== '';

    return (
      <div ref={ref} role='group' className={`flex flex-col gap-1 ${fullWidth ? 'w-full' : ''}`}>
        {label !== undefined && (
          <label className='text-sm' htmlFor={id}>
            {label}
          </label>
        )}

        <CreatableSelect
          {...selectProps}
          styles={customStyles(isError)}
          isMulti
          options={options}
          placeholder={placeholder}
          onCreateOption={async (inputValue) => {
            setIsLoading(true);
            await onCreate(inputValue);
            setIsLoading(false);
          }}
          onChange={(newValue) => onOptionChange(newValue as ReactSelectOption[])}
          isDisabled={isLoading}
          isLoading={isLoading}
          isClearable={false}
        />

        {isError ? <span className='text-sm text-danger'>{error}</span> : null}
      </div>
    );
  },
);

SelectMultiCreatable.displayName = 'SelectMultiCreatable';
