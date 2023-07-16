import { FieldType } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { postSchema } from '@/app/api/admin/form/[formId]/field/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authForm } from '@/utils/auth/resources/form';
import { FIELD_COUNT_LIMIT } from '@/utils/validation/field';

/**
 * フィールド作成
 */
export async function POST(req: Request, { params }: { params: { formId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  await authForm(session.user.id, Number(params.formId));

  const reqJson = await req.json();
  const parsed = postSchema.safeParse(reqJson);
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

  const { type } = parsed.data;

  try {
    const count = await prisma.field.count({ where: { formId: Number(params.formId) } });
    if (count >= FIELD_COUNT_LIMIT) {
      throw new Error('項目の作成上限に達しました。');
    }

    const field = await prisma.field.create({
      data: {
        formId: Number(params.formId),
        name: '設問名',
        description: '',
        type: type,
        ...(type === FieldType.SELECT
          ? {
              fieldSelect: {
                create: {
                  fieldSelectOptions: {
                    create: [
                      {
                        label: '項目1',
                        price: 0,
                      },
                    ],
                  },
                },
              },
            }
          : {
              fieldNumber: {
                create: {
                  fieldNumberRanges: {
                    create: [
                      {
                        gte: undefined,
                        lt: 1,
                        price: 0,
                      },
                      {
                        gte: 1,
                        lt: undefined,
                        price: 1,
                      },
                    ],
                  },
                },
              },
            }),
      },
      include: {
        fieldSelect: {
          include: {
            fieldSelectOptions: true,
          },
        },
        fieldNumber: {
          include: {
            fieldNumberRanges: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(field), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
