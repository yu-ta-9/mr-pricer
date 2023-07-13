import { cache } from 'react';

import { Publish } from '@/components/pages/Publish';
import { prisma } from '@/lib/prisma';
import { ToastProvider } from '@/providers/ToastProvider';
import { getS3PresignedUrl } from '@/utils/aws/s3';

import type { Metadata } from 'next';

type Props = {
  params: {
    friendlyKey: string;
  };
};

const getForm = cache(async (friendlyKey: string) => {
  const form = await prisma.form.findFirstOrThrow({
    where: { friendlyKey },
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

  return form;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const form = await getForm(params.friendlyKey);
  return { title: form.name, description: form.description || form.name };
}

const FriendlyKey = async ({ params }: Props) => {
  const form = await getForm(params.friendlyKey);

  let profileIconUrl;
  if (form.profile !== null && form.profile.iconKey !== null) {
    profileIconUrl = await getS3PresignedUrl(form.userId, String(form.profile.id), form.profile.iconKey);
  }

  return (
    <ToastProvider>
      <Publish formData={form as any} profileIconUrl={profileIconUrl} />
    </ToastProvider>
  );
};

export default FriendlyKey;
