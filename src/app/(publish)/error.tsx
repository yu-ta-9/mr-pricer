'use client';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Error',
  description: 'Error',
};

const Error = () => {
  return (
    <div className='min-h-screen p-24'>
      <p className='text-danger'>既に存在しないフォームです。</p>
    </div>
  );
};

export default Error;
