import { getServerSession } from 'next-auth';

import { postSchema } from '@/app/api/admin/form/[formId]/field/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authForm } from '@/utils/auth/resources/form';
import { FIELD_COUNT_LIMIT } from '@/utils/validation/field';

import type { FieldType } from '@prisma/client';

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

  const { type, parentConditionId } = parsed.data;

  try {
    const count = await prisma.field.count({ where: { formId: Number(params.formId) } });
    if (count >= FIELD_COUNT_LIMIT) {
      return new Response(
        JSON.stringify({
          message: 'Bad Request',
          issues: '項目の作成上限に達しました。',
        }),
        {
          status: 400,
        },
      );
    }

    const field = await prisma.field.create({
      data: {
        formId: Number(params.formId),
        name: '設問名',
        description: '',
        type: type,
        ...(parentConditionId !== undefined
          ? {
              parentFieldConditionId: parentConditionId,
            }
          : undefined),
        ...getFieldDetailParams(type),
      },
      include: {
        fieldConditionBranches: true,
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
        fieldCondition: {
          include: {
            fieldConditionBranches: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(Object.assign(field, { fields: [] })), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}

const getFieldDetailParams = (type: FieldType): any => {
  switch (type) {
    case 'SELECT':
      return {
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
      };
    case 'NUMBER':
      return {
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
      };
    case 'CONDITION':
      return {
        fieldCondition: {
          create: {
            fieldConditionBranches: {
              create: [
                {
                  label: '選択肢1',
                },
              ],
            },
          },
        },
      };
  }
};
