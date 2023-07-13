import { Edit } from '@/components/pages/form/Edit';
import { prisma } from '@/lib/prisma';
import { ToastProvider } from '@/providers/ToastProvider';
import { getAuthenticateSession } from '@/utils/server/auth';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム編集',
  description: 'フォーム編集',
};

const EditPage = async ({ params }: { params: { formId: string } }) => {
  const session = await getAuthenticateSession();

  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user!.id } });
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
    const profiles = await prisma.profile.findMany({ where: { userId: user.id }, orderBy: { id: 'asc' } });

    // TODO: 後で考える
    return (
      <ToastProvider>
        <Edit formData={form as any} profilesData={profiles} />
      </ToastProvider>
    );
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
