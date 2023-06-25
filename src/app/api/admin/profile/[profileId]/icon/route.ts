import cryptoRandomString from 'crypto-random-string';
import { getServerSession } from 'next-auth';

import { postSchema } from '@/app/api/admin/profile/[profileId]/icon/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formDataToObject } from '@/utils/api/formDataToObject';
import { authProfile } from '@/utils/auth/resources/profile';
import { getS3PresignedUrl, uploadFileToS3 } from '@/utils/aws/s3';

/**
 * アイコン更新
 * MEMO: formidableがapp routerでまだ使えないようなので、対応を待つ
 * https://github.com/vercel/next.js/issues/48875#issuecomment-1592301037
 */
export async function POST(req: Request, { params }: { params: { profileId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  await authProfile(session.user.id, Number(params.profileId));

  const formData = await req.formData();
  // TODO: zennで書いてみる、formDataにzod適用
  const resJson = formDataToObject(formData);
  const parsed = await postSchema.safeParse(resJson);

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

  let iconUrl;
  try {
    const profile = await prisma.$transaction(async (tx) => {
      const { iconFile } = parsed.data;
      const iconFileKey = `${cryptoRandomString({ length: 16 })}.${iconFile.name.split('.').pop()}`;

      const profile = await tx.profile.update({
        where: { id: Number(params.profileId) },
        data: {
          iconKey: iconFileKey,
        },
      });

      await uploadFileToS3(iconFile, session.user!.id, params.profileId, iconFileKey);
      iconUrl = await getS3PresignedUrl(session.user!.id, params.profileId, iconFileKey);

      return profile;
    });

    if (iconUrl === undefined) {
      throw new Error('iconUrl is not found');
    }

    return new Response(JSON.stringify({ profile, iconUrl }), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
