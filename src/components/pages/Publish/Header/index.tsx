import { usePublishPageContext } from '@/components/pages/Publish/usePublishPageContext';

import type { FC } from 'react';

type Props = {
  heading: string;
};

export const Header: FC<Props> = ({ heading }) => {
  const { formData } = usePublishPageContext();
  return (
    <header
      className='sticky top-0 left-0 h-16 shadow-lg bg-primary z-[10000]'
      style={{
        backgroundColor: formData?.profile?.profileTheme?.primaryColor,
        color: formData?.profile?.profileTheme?.textColor,
      }}
    >
      <div className='flex items-center justify-center h-full px-4 py-2'>
        <div className='flex gap-4'>
          <h1 className='text-2xl font-bold'>{heading}</h1>
        </div>
      </div>
    </header>
  );
};
