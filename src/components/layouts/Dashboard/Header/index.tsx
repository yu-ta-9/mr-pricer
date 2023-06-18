import { Bars3Icon } from '@heroicons/react/24/solid';
import { useSession } from 'next-auth/react';

import type { FC } from 'react';

type Props = {
  onDrawer: () => void;
};

export const Header: FC<Props> = ({ onDrawer }) => {
  const session = useSession();

  return (
    <header className='sticky top-0 left-0 h-16 shadow-lg bg-primary z-[10000]'>
      <div className='flex items-center justify-between h-full px-4 py-2'>
        <div className='flex gap-4'>
          <button
            type='button'
            data-drawer-target='drawer-navigation'
            data-drawer-show='drawer-navigation'
            aria-controls='drawer-navigation'
            onClick={onDrawer}
          >
            <Bars3Icon className='w-6 h-6 text-black' />
          </button>
          <h1 className='text-2xl font-bold'>Mr. Pricer</h1>
        </div>

        <div>
          <img src={session.data?.user?.image || ''} alt='profile' className='w-8 h-8 rounded-full' />
        </div>
      </div>
    </header>
  );
};
