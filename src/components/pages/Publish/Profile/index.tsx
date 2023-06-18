import { usePublishPageContext } from '@/components/pages/Publish/usePublishPageContext';

import type { FC } from 'react';

export const Profile: FC = () => {
  const { formData } = usePublishPageContext();

  return (
    <div className='flex flex-col items-center w-full gap-4 p-4 bg-white border-2 rounded-lg border-primary'>
      <div className='flex items-center justify-center w-20 h-20'>
        <img src='/next.svg' alt='user' />
      </div>
      <h1 className='text-2xl font-bold'>YU-TA-9</h1>
      <div className='flex items-center font-normal text-black'>楽曲制作やってます。受賞歴：〇〇、〇〇</div>
    </div>
  );
};
