'use client';

import { signIn } from 'next-auth/react';

export const LoginForm = () => {
  return (
    <div className='flex flex-col items-center gap-4 font-mono'>
      <p className='italic font-bold text-primary'>見積もりフォーム作成アプリ</p>

      <div>
        <img src='/images/icon.png' alt='' className='w-24 h-24' />
      </div>

      <div className='text-center'>
        <h1 className='text-xl font-bold text-black'>Mr. Pricer</h1>
        <p>（β版）</p>
      </div>

      <iframe
        width='560'
        height='315'
        src='https://www.youtube.com/embed/ZTixlAgww-g?rel=0&loop=1&playlist=ZTixlAgww-g'
        title='YouTube video player'
        frameBorder='0'
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
      ></iframe>

      <p className='font-bold text-black'>以下からご利用いただけます↓</p>

      <button
        type='button'
        className='text-white w-full  bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center justify-between dark:focus:ring-[#4285F4]/55 sm:w-60'
        onClick={() => signIn('google')}
      >
        <svg
          className='w-4 h-4 mr-2 -ml-1'
          aria-hidden='true'
          focusable='false'
          data-prefix='fab'
          data-icon='google'
          role='img'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 488 512'
        >
          <path
            fill='currentColor'
            d='M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z'
          ></path>
        </svg>
        <span className='w-full text-center'>Googleでログイン</span>
      </button>
    </div>
  );
};
