/** @jsxImportSource @emotion/react */

import { type FC, type ReactNode } from 'react';

import { customStyle } from '@/components/ui/IconButton/customStyle';

import type { CustomColor } from '@/components/ui/type';
import type { CSSProperties } from 'react';

type ButtonTheme = 'primary' | 'secondary' | 'black' | 'danger';

type Props = {
  theme: ButtonTheme;
  className?: string;
  svgComponent: (className: string, style?: CSSProperties) => ReactNode;
  onClick: () => void;
  bgFill?: boolean;
} & CustomColor &
  React.ButtonHTMLAttributes<HTMLButtonElement>;

const themeClasses = (theme: ButtonTheme) => {
  switch (theme) {
    case 'primary':
      return 'fill-primary hover:opacity-50';
    case 'secondary':
      return 'fill-secondary hover:opacity-50';
    case 'black':
      return 'fill-black hover:opacity-50';
    case 'danger':
      return 'fill-danger hover:opacity-50';
  }
};

const themeClassesBgFill = (theme: ButtonTheme) => {
  switch (theme) {
    case 'primary':
      return 'bg-primary';
    case 'secondary':
      return 'bg-secondary';
    case 'black':
      return 'bg-black';
    case 'danger':
      return 'bg-danger';
  }
};

export const IconButton: FC<Props> = ({
  theme,
  className,
  svgComponent,
  onClick,
  bgFill,
  customColor,
  ...buttonProps
}) => {
  if (bgFill) {
    return (
      <button
        {...buttonProps}
        css={customColor !== undefined ? customStyle(customColor) : undefined}
        className={`flex items-center justify-center p-2 rounded-full hover:bg-opacity-50 ${themeClassesBgFill(theme)}`}
        type='button'
        onClick={onClick}
      >
        <span>{svgComponent(`w-4 h-4 stroke-2 fill-white`)}</span>
      </button>
    );
  }

  return (
    <button
      {...buttonProps}
      css={customColor !== undefined ? customStyle(customColor) : undefined}
      className={className}
      type='button'
      onClick={onClick}
    >
      <span>{svgComponent(`w-8 h-8 stroke-2 ${themeClasses(theme)}`)}</span>
    </button>
  );
};
