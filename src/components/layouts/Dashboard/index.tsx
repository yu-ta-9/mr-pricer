'use client';

import { useState } from 'react';

import { Header } from '@/components/layouts/Dashboard/Header';
import { Sidebar } from '@/components/layouts/Dashboard/Sidebar';

import type { FC } from 'react';

type Props = {
  children: React.ReactNode;
};

export const Dashboard: FC<Props> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDrawer = () => setIsOpen(!isOpen);

  return (
    <>
      <Header onDrawer={handleDrawer} />

      <Sidebar isOpen={isOpen} onDrawer={handleDrawer} />

      <main className='min-h-screen min-w-min'>{children}</main>
    </>
  );
};
