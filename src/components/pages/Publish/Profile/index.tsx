import { usePublishPageContext } from '@/components/pages/Publish/usePublishPageContext';

import type { FC } from 'react';

export const Profile: FC = () => {
  const { formData, profileIconUrl } = usePublishPageContext();

  if (formData === undefined) {
    return null;
  }

  if (formData.profile === null) {
    return null;
  }

  return (
    <div className='flex flex-col items-center w-full gap-4 p-4 bg-white border-2 rounded-lg border-primary'>
      {profileIconUrl !== undefined && (
        <div className='flex items-center justify-center w-24 h-24'>
          <img src={profileIconUrl} alt='user' className='w-full h-2full' />
        </div>
      )}

      <h1 className='text-2xl font-bold'>{formData.profile.name}</h1>
      <div className='flex items-center font-normal text-black break-words whitespace-pre'>
        {formData.profile.content}
      </div>
    </div>
  );
};
