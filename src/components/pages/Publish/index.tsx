'use client';

import { Ad } from '@/components/pages/Publish/Ad';
import { PublishPageContext } from '@/components/pages/Publish/context';
import { Form } from '@/components/pages/Publish/Form';
import { Header } from '@/components/pages/Publish/Header';
import { Profile } from '@/components/pages/Publish/Profile';

import type { FormData } from '@/components/pages/Publish/type';
import type { FC } from 'react';

type Props = {
  formData: FormData;
  profileIconUrl?: string;
};

export const Publish: FC<Props> = ({ formData, profileIconUrl }) => {
  return (
    <PublishPageContext.Provider value={{ formData, profileIconUrl }}>
      <Header heading={formData.name} />

      <main
        className='min-h-screen p-12 min-w-min'
        style={{
          backgroundColor: formData.profile?.profileTheme?.formBackgroundColor,
          color: formData.profile?.profileTheme?.textColor,
        }}
      >
        <div className='flex flex-col items-center w-full max-w-5xl gap-4 mx-auto font-mono text-sm sm:w-3/5'>
          {formData.profile !== undefined && <Profile />}

          <Form />
        </div>

        <hr className='w-full h-[2px] max-w-5xl mx-auto mt-4 rounded sm:w-3/5 bg-base-primary' />

        <div className='w-full max-w-5xl mx-auto sm:w-3/5'>
          <Ad />
        </div>
      </main>
    </PublishPageContext.Provider>
  );
};
