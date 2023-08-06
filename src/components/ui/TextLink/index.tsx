/** @jsxImportSource @emotion/react */

import Link from 'next/link';

import { customStyle } from '@/components/ui/TextLink/customStyle';

import type { CustomColor } from '@/components/ui/type';
import type { FC } from 'react';

type Props = {
  type: 'internal' | 'external';
  label: string;
  href: string;
} & CustomColor;

export const TextLink: FC<Props> = ({ type, label, href, customColor }) => {
  const className = 'underline text-primary';

  if (type === 'internal') {
    return (
      <Link css={customColor !== undefined ? customStyle(customColor) : undefined} className={className} href={href}>
        {label}
      </Link>
    );
  }

  return (
    <a
      css={customColor !== undefined ? customStyle(customColor) : undefined}
      className={className}
      target='_blank'
      rel='noopener noreferrer'
      href={href}
    >
      {label}
    </a>
  );
};
