import type { FC } from 'react';

type Props = {
  label: string;
};
export const Heading: FC<Props> = ({ label }) => {
  return <div className='p-4 custom-heading bg-secondary w-fit'>{label}</div>;
};
