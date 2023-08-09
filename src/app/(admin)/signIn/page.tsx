import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { LoginForm } from '@/components/LoginForm';
import { authOptions } from '@/lib/auth';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SignIn',
  description: 'Sign in to your account',
};

const SignIn = async () => {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect('/');
  }

  return (
    <main className='flex flex-col items-center justify-center min-h-screen p-24'>
      <LoginForm />
    </main>
  );
};

export default SignIn;
