import { Inter } from 'next/font/google';

import '../globals.css';

import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mr.Pricer',
  description: 'Mr.Pricer',
};

const PublishLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja'>
      <body className={inter.className}>{children}</body>
    </html>
  );
};

export default PublishLayout;
