'use client';
/** @jsxImportSource @emotion/react */

import { customStyle } from '@/components/ui/Heading/customStyle';

import type { CustomColor } from '@/components/ui/type';
import type { FC } from 'react';

type Props = {
  label: string;
} & CustomColor;

export const Heading: FC<Props> = ({ label, customColor }) => {
  return (
    <div
      css={customColor !== undefined ? customStyle(customColor) : undefined}
      className='relative p-4 text-sm text-white font-bold bg-primary before:bg-base-primary before:absolute before:content-[""] before:top-0 before:left-0 before:h-full before:w-2 w-fit'
    >
      {label}
    </div>
  );
};
