import { Inter } from 'next/font/google';

import '../globals.css';

import { AuthProvider } from '@/components/providers/AuthProvider';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mr.Pricer',
  description: 'Mr.Pricer',
};

const inter = Inter({ subsets: ['latin'] });

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};

export default DashboardLayout;
