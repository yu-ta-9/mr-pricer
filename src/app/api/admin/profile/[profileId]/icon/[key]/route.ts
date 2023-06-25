import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { deleteFileOnS3 } from '@/utils/aws/s3';

/**
 * アイコン削除
 */
export async function DELETE(_request: Request, { params }: { params: { profileId: string; key: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  try {
    await prisma.$transaction(async (tx) => {
      const userProfile = await tx.user.update({
        where: { id: session.user!.id },
        data: {
          profiles: {
            update: {
              where: {
                id: Number(params.profileId),
              },
              data: {
                iconKey: null,
              },
            },
          },
        },
        include: {
          profiles: true,
        },
      });

      await deleteFileOnS3(session.user!.id, params.profileId, params.key);

      return userProfile;
    });

    return new Response(JSON.stringify({ result: 'ok' }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
