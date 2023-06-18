'use client';

import Link from 'next/link';

const Error = () => {
  return (
    <div className='min-h-screen p-24'>
      <h1 className='text-danger'>500 - Error</h1>
      <Link className='underline' href='/'>
        TOPへ
      </Link>
    </div>
  );
};

export default Error;
