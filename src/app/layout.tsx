import { Inter } from 'next/font/google';

import { AuthProvider } from '@/providers/AuthProvider';

import type { Metadata } from 'next';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mr.Pricer',
  description: 'I`m Mr.Pricer. I`ll help you to find the best price.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  openGraph: {
    url: 'https://www.mr-pricer.com',
    type: 'website',
    title: 'Mr.Pricer',
    description: 'I`m Mr.Pricer. I`ll help you to find the best price.',
    locale: 'ja_JP',
    images: ['https://www.mr-pricer.com/images/ogp.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr.Pricer',
    description: 'I`m Mr.Pricer. I`ll help you to find the best price.',
    images: ['https://www.mr-pricer.com/images/ogp.png'],
  },
  icons: {
    icon: [
      { url: '/favicons/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicons/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [{ sizes: '180x180', url: '/favicons/apple-touch-icon.png' }],
    other: [
      {
        rel: 'manifest',
        url: '/favicons/site.webmanifest',
      },
      {
        rel: 'mask-icon',
        url: '/favicons/safari-pinned-tab.svg',
      },
    ],
  },
  themeColor: '#ffffff',
  other: {
    msapplicationTileColor: '#00aba9',
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
