import { Edit } from '@/components/pages/profile/Edit';
import { prisma } from '@/lib/prisma';
import { getS3PresignedUrl } from '@/utils/aws/s3';
import { getAuthenticateSession } from '@/utils/server/auth';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プロフィール編集',
  description: 'プロフィール編集',
};

const EditPage = async ({ params }: { params: { profileId: string } }) => {
  const session = await getAuthenticateSession();

  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user!.id } });
    const profile = await prisma.profile.findFirstOrThrow({
      where: { id: Number(params.profileId), userId: user.id },
      select: {
        id: true,
        name: true,
        content: true,
        iconKey: true,
        profileLinks: {
          select: {
            id: true,
            profileId: true,
            label: true,
            url: true,
          },
        },
        profileTheme: true,
      },
    });

    let profileIconUrl;
    if (profile.iconKey !== null) {
      try {
        profileIconUrl = await getS3PresignedUrl(session.user!.id, String(profile.id), profile.iconKey);
      } catch (err) {
        // S3から取得できなかった場合は一旦無視
        console.error('s3 profile icon url failed: ', err);
      }
    }

    return <Edit profileData={profile} profileIconUrl={profileIconUrl} />;
  } catch (err) {
    return {
      redirect: {
        destination: '/not-found',
        statusCode: 404,
      },
    };
  }
};

export default EditPage;
