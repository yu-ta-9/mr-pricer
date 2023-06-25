import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';

import type { Session } from 'next-auth';

/**
 * 認証済みセッションを取得する
 * @returns
 */
export const getAuthenticateSession = async (): Promise<Session> => {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    redirect('/signIn');
  }

  return session;
};
