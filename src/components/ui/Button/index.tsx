'use client';
/** @jsxImportSource @emotion/react */

import { forwardRef, type ReactNode } from 'react';

import { customStyle } from '@/components/ui/Button/customStyle';

import type { CustomColor } from '@/components/ui/type';

type ButtonTheme = 'primary' | 'secondary' | 'danger';

type Props = {
  children: ReactNode;
  theme: ButtonTheme;
  svgComponent?: (className: string) => ReactNode;
  type: 'button' | 'submit';
  onClick?: () => void;
  fullWidth?: boolean;
} & CustomColor &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const themeClasses = (theme: ButtonTheme) => {
  switch (theme) {
    case 'primary':
      return 'bg-primary hover:bg-opacity-50 disabled:bg-opacity-50';
    case 'secondary':
      return 'bg-secondary hover:bg-opacity-50 disabled:bg-opacity-50';
    case 'danger':
      return 'bg-danger hover:bg-opacity-50 disabled:bg-opacity-50';
  }
};

export const Button = forwardRef<HTMLButtonElement, Props>(
  ({ children, theme, svgComponent, type, onClick, fullWidth, customColor, ...buttonProps }, ref) => {
    return (
      <button
        {...buttonProps}
        css={customColor !== undefined ? customStyle(customColor) : undefined}
        ref={ref}
        type={type}
        onClick={onClick}
        className={`flex items-center gap-1 px-4 py-2 font-bold text-white rounded-full ${
          fullWidth ? 'w-full' : 'w-fit'
        } ${themeClasses(theme)} ${buttonProps.className || ''}`}
      >
        {svgComponent && <span>{svgComponent('w-4 h-4 stroke-2')}</span>}

        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
