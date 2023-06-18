import { getServerSession } from 'next-auth';

import { Edit } from '@/components/pages/Edit';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Edit',
  description: 'Edit',
};

const EditPage = async ({ params }: { params: { formId: string } }) => {
  const session = await getServerSession(authOptions);
  try {
    if (!session || session.user === undefined) {
      throw new Error('session is undefined');
    }
  } catch (err) {
    return {
      redirect: {
        destination: '/signIn',
        permanent: false,
      },
    };
  }

  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user.id } });
    const form = await prisma.form.findFirstOrThrow({
      where: { id: Number(params.formId), userId: user.id },
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

    // TODO: 後で考える
    return <Edit formData={form as any} />;
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
