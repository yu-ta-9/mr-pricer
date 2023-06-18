'use client';

import { PublishPageContext } from '@/components/pages/Publish/context';
import { Form } from '@/components/pages/Publish/Form';
import { Header } from '@/components/pages/Publish/Header';
import { Profile } from '@/components/pages/Publish/Profile';

import type { FormData } from '@/components/pages/Publish/type';
import type { FC } from 'react';

type Props = {
  formData: FormData;
};

export const Publish: FC<Props> = ({ formData }) => {
  return (
    <PublishPageContext.Provider value={{ formData }}>
      <Header heading={formData.name} />

      <main className='min-h-screen p-12 min-w-min'>
        <div className='flex flex-col items-center w-full max-w-5xl gap-4 mx-auto font-mono text-sm sm:w-3/5'>
          <Profile />

          <Form />
        </div>
      </main>
    </PublishPageContext.Provider>
  );
};
