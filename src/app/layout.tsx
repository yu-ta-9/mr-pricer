import { Inter } from 'next/font/google';

import { AuthProvider } from '@/providers/AuthProvider';

import type { Metadata } from 'next';

import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mr.Pricer',
  description: 'I`m Mr.Pricer. I`ll help you to find the best price.',
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
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='ja'>
      <head>
        <link rel='apple-touch-icon' sizes='180x180' href='/favicons/apple-touch-icon.png' />
        <link rel='icon' type='image/png' sizes='32x32' href='/favicons/favicon-32x32.png' />
        <link rel='icon' type='image/png' sizes='16x16' href='/favicons/favicon-16x16.png' />
        <link rel='manifest' href='/favicons/site.webmanifest' />
        <link rel='mask-icon' href='/favicons/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#00aba9' />
        <meta name='theme-color' content='#ffffff' />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
