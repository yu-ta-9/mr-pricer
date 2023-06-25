import Head from 'next/head';

import { Publish } from '@/components/pages/Publish';
import { prisma } from '@/lib/prisma';
import { getS3PresignedUrl } from '@/utils/aws/s3';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mr.Pricer',
  description: 'Mr.Pricer',
};

const FriendlyKey = async ({ params }: { params: { friendlyKey: string } }) => {
  const key = params.friendlyKey;
  const form = await prisma.form.findFirstOrThrow({
    where: { friendlyKey: key },
    include: {
      profile: {
        include: {
          profileLinks: true,
        },
      },
      fields: {
        include: {
          fieldSelect: {
            include: {
              fieldSelectOptions: {
                orderBy: {
                  id: 'asc',
                },
              },
            },
          },
          fieldNumber: {
            include: {
              fieldNumberRanges: {
                orderBy: {
                  id: 'asc',
                },
              },
            },
          },
        },
        orderBy: {
          id: 'asc',
        },
      },
    },
  });

  let profileIconUrl;
  if (form.profile !== null && form.profile.iconKey !== null) {
    profileIconUrl = await getS3PresignedUrl(form.userId, String(form.profile.id), form.profile.iconKey);
  }

  return (
    <>
      <Head>
        <title>{form.name}</title>
        <meta name='description' content={form.description || form.name} />
      </Head>

      <Publish formData={form as any} profileIconUrl={profileIconUrl} />
    </>
  );
};

export default FriendlyKey;
