import type { FC, ReactNode } from 'react';

type ButtonTheme = 'primary' | 'secondary' | 'danger';

type Props = {
  children: ReactNode;
  theme: ButtonTheme;
  svgComponent?: (className: string) => ReactNode;
  type: 'button' | 'submit';
  onClick?: () => void;
  fullWidth?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

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

export const Button: FC<Props> = ({ children, theme, svgComponent, type, onClick, fullWidth, ...buttonProps }) => {
  return (
    <button
      {...buttonProps}
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
};
