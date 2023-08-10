import type { FC } from 'react';

export const Ad: FC = () => {
  const handleAreaClick = () => {
    window.open(`${process.env.NEXT_PUBLIC_BASE_URL}/signIn`, '_blank');
  };

  return (
    <section className='flex flex-col items-center self-center gap-2 p-4 bg-white'>
      <span className='text-sm italic text-primary'>こちらのフォームはMr.Pricerによって作られました</span>
      <div
        role='button'
        onClick={handleAreaClick}
        className='flex flex-col items-center cursor-pointer hover:opacity-50'
      >
        <img src='/images/ogp.png' alt='' className='w-full h-auto shadow sm:w-3/5' />
      </div>
    </section>
  );
};
