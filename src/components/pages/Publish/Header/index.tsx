import type { FC } from 'react';

type Props = {
  heading: string;
};

export const Header: FC<Props> = ({ heading }) => {
  return (
    <header className='sticky top-0 left-0 h-16 shadow-lg bg-primary'>
      <div className='flex items-center justify-center h-full px-4 py-2'>
        <div className='flex gap-4'>
          <h1 className='text-2xl font-bold'>{heading}</h1>
        </div>
      </div>
    </header>
  );
};
