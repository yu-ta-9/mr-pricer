import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';
import { signOut } from 'next-auth/react';

import type { FC } from 'react';

type Props = {
  isOpen: boolean;
  onDrawer: () => void;
};

export const Sidebar: FC<Props> = ({ isOpen, onDrawer }) => {
  return (
    <>
      <aside
        id='drawer-navigation'
        className={
          'shadow-lg fixed top-0 left-0 z-40 w-64 h-screen p-4 overflow-y-auto transition-transform bg-white dark:bg-gray-800 z-[10010]' +
          (isOpen ? '' : ' -translate-x-full')
        }
        tabIndex={-1}
        aria-labelledby='drawer-navigation-label'
      >
        <h5 id='drawer-navigation-label' className='text-base font-semibold text-gray-500 uppercase dark:text-gray-400'>
          Menu
        </h5>
        <button
          type='button'
          data-drawer-hide='drawer-navigation'
          aria-controls='drawer-navigation'
          className='text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 absolute top-2.5 right-2.5 inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white'
          onClick={onDrawer}
        >
          <svg
            aria-hidden='true'
            className='w-5 h-5'
            fill='currentColor'
            viewBox='0 0 20 20'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            ></path>
          </svg>
          <span className='sr-only'>Close menu</span>
        </button>
        <div className='py-4 overflow-y-auto'>
          <ul className='space-y-2 font-medium'>
            <li>
              <a href='/dashboard' className='flex items-center p-2 text-gray-900 rounded-lg'>
                <svg
                  aria-hidden='true'
                  className='w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                  fill='currentColor'
                  viewBox='0 0 20 20'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path d='M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z'></path>
                  <path d='M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z'></path>
                </svg>
                <span className='ml-3'>Dashboard</span>
              </a>
            </li>
            <li>
              <a
                href='#'
                onClick={() => signOut({ callbackUrl: '/signIn' })}
                className='flex items-center p-2 text-gray-900 rounded-lg'
              >
                <ArrowLeftOnRectangleIcon className='w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 ' />
                <span className='ml-3'>Sign out</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>

      {isOpen && (
        <div className='fixed top-0 left-0 w-full h-full bg-black opacity-25 z-[10005]' onClick={onDrawer}></div>
      )}
    </>
  );
};
