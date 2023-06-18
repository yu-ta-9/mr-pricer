import Head from 'next/head';

import { Publish } from '@/components/pages/Publish';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mr.Pricer',
  description: 'Mr.Pricer',
};

const FriendlyKey = async ({ params }: { params: { friendlyKey: string } }) => {
  const key = params.friendlyKey;
  console.log('key', key);
  const form = await prisma.form.findFirstOrThrow({
    where: { friendlyKey: key },
    include: {
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

  return (
    <>
      <Head>
        <title>{form.name}</title>
        <meta name='description' content={form.description || form.name} />
      </Head>

      <Publish formData={form as any} />
    </>
  );
};

export default FriendlyKey;
