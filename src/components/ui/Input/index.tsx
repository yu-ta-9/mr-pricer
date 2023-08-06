'use client';
/** @jsxImportSource @emotion/react */

import { forwardRef } from 'react';

import { customStyle } from '@/components/ui/Input/customStyle';

import type { CustomColor } from '@/components/ui/type';

type Props = {
  label?: string;
  placeholder?: string;
  type: 'text' | 'number' | 'url';
  fullWidth?: boolean;
  error?: string;
} & CustomColor &
  React.InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, type, placeholder, fullWidth, error, customColor, ...inputProps }, ref) => {
    const isError = error !== undefined && error !== '';

    return (
      <label className={`${fullWidth ? 'w-full' : ''}`}>
        {label !== undefined && <span className='text-sm'>{label}</span>}
        <input
          {...inputProps}
          css={customColor !== undefined ? customStyle(customColor) : undefined}
          ref={ref}
          className={
            'block w-full mt-1 text-sm rounded-md shadow-sm color-base-primary border-base-primary focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50' +
            (isError ? ' border-danger' : '')
          }
          type={type}
          placeholder={placeholder}
        />

        {isError ? <span className='text-sm text-danger'>{error}</span> : null}
      </label>
    );
  },
);

Input.displayName = 'Input';
