import Link from 'next/link';

import type { FC } from 'react';

type Props = {
  type: 'internal' | 'external';
  label: string;
  href: string;
};

export const TextLink: FC<Props> = ({ type, label, href }) => {
  const className = 'underline text-primary';

  if (type === 'internal') {
    return (
      <Link className={className} href={href}>
        {label}
      </Link>
    );
  }

  return (
    <a className={className} target='_blank' rel='noopener noreferrer' href={href}>
      {label}
    </a>
  );
};
