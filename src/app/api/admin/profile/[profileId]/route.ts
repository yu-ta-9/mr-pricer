import { getServerSession } from 'next-auth';

import { putSchema } from '@/app/api/admin/profile/[profileId]/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authProfile } from '@/utils/auth/resources/profile';
import { deleteFileOnS3 } from '@/utils/aws/s3';

/**
 * プロフィール更新
 */
export async function PUT(req: Request, { params }: { params: { profileId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  await authProfile(session.user.id, Number(params.profileId));

  const resJson = await req.json();
  const parsed = await putSchema.safeParse(resJson);

  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        message: 'Bad Request',
        issues: JSON.parse(parsed.error.message),
      }),
      {
        status: 400,
      },
    );
  }

  try {
    const profile = await prisma.$transaction(async (tx) => {
      const { name, content, profileLinks, deleteProfileLinksIds } = parsed.data;

      const profile = await tx.profile.update({
        where: { id: Number(params.profileId) },
        data: {
          name,
          content,
          profileLinks: {
            upsert:
              profileLinks?.map((profileLink) => ({
                where: {
                  id: profileLink.id || 0,
                },
                create: {
                  label: profileLink.label,
                  url: profileLink.url,
                },
                update: {
                  label: profileLink.label,
                  url: profileLink.url,
                },
              })) || [],
            deleteMany: deleteProfileLinksIds?.map((id) => ({ id })) || [],
          },
        },

        include: {
          profileLinks: true,
        },
      });

      return profile;
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

/**
 * プロフィール削除
 */
export async function DELETE(_request: Request, { params }: { params: { profileId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  await authProfile(session.user.id, Number(params.profileId));

  const profileIconKey = await prisma.profile.findUnique({
    where: {
      id: Number(params.profileId),
    },
    select: {
      iconKey: true,
    },
  });

  // TODO: zennで書いてみる
  await prisma.profile.delete({
    where: { id: Number(params.profileId) },
  });

  if (profileIconKey?.iconKey) {
    await deleteFileOnS3(session.user.id, params.profileId, profileIconKey.iconKey);
  }

  return new Response(JSON.stringify({ result: 'ok' }), { status: 200 });
}
