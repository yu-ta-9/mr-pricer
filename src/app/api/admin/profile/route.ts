import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PROFILE_COUNT_LIMIT } from '@/utils/validation/profile';

/**
 * プロフィール作成
 */
export async function POST(_req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  try {
    const profileCount = await prisma.profile.count({ where: { userId: session.user.id } });
    if (profileCount >= PROFILE_COUNT_LIMIT) {
      throw new Error('プロフィールの作成上限に達しました。');
    }

    const profile = await prisma.profile.create({
      data: {
        userId: session.user.id,
        name: 'プロフィール',
        content: '私の紹介です。',
      },
    });

    return new Response(JSON.stringify(profile), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
