import { type FC } from 'react';

import { TooltipContainer } from '@/components/ui/TooltipContainer';

import type { ComponentProps, ReactNode } from 'react';

type Option = {
  label: string;
  onClick: () => void;
  isDanger?: boolean;
  svgComponent?: (className: string) => ReactNode;
};

type Props = {
  options: Option[];
} & ComponentProps<typeof TooltipContainer>;

export const Tooltip: FC<Props> = ({ options, ...tooltipContainerProps }) => {
  return (
    <TooltipContainer {...tooltipContainerProps}>
      <ul className='my-2'>
        {options.map((option) => (
          <li key={option.label} className={`py-1 hover:bg-secondary ${option.isDanger ? 'text-danger' : ''}`}>
            <button type='button' className='flex items-center w-full gap-2 px-2'>
              {option.svgComponent !== undefined && <span>{option.svgComponent('w-4 h-4')}</span>}
              {option.label}
            </button>
          </li>
        ))}
      </ul>
    </TooltipContainer>
  );
};
