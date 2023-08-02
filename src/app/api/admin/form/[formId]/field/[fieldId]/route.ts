import { FieldType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { putSchema } from '@/app/api/admin/form/[formId]/field/[fieldId]/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authForm } from '@/utils/auth/resources/form';
import { HTTP_STATUS_CODE } from '@/utils/httpStatusCode';

/**
 * フィールド更新
 */
export async function PUT(req: Request, { params }: { params: { formId: string; fieldId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: HTTP_STATUS_CODE.UNAUTHORIZED,
    });
  }

  await authForm(session.user.id, Number(params.formId));

  const reqJson = await req.json();
  const parsed = putSchema.safeParse(reqJson);
  if (!parsed.success) {
    return new Response(
      JSON.stringify({
        message: 'Bad Request',
        issues: JSON.parse(parsed.error.message),
      }),
      {
        status: HTTP_STATUS_CODE.BAD_REQUEST,
      },
    );
  }

  try {
    const field = await prisma.field.findFirstOrThrow({
      where: {
        id: Number(params.fieldId),
        formId: Number(params.formId),
      },
      include: {
        fieldSelect: true,
        fieldNumber: true,
      },
    });

    const updateField = await prisma.$transaction(async (tx) => {
      if (parsed.data.fieldConditionBranchIds !== undefined) {
        // 条件分岐付与
        parsed.data.fieldConditionBranchIds?.map(async (id) => {
          await tx.fieldConditionBranchesOnFields.upsert({
            where: {
              fieldConditionBranchId_fieldId: {
                fieldId: field.id,
                fieldConditionBranchId: id,
              },
            },
            create: {
              fieldId: field.id,
              fieldConditionBranchId: id,
            },
            update: {},
          });
        });

        await tx.fieldConditionBranchesOnFields.deleteMany({
          where: {
            fieldId: field.id,
            fieldConditionBranchId: {
              notIn: parsed.data.fieldConditionBranchIds || [],
            },
          },
        });
      }

      // フィールド更新
      const updateField = await tx.field.update({
        where: { id: field.id },
        data: {
          name: parsed.data.name,
          description: parsed.data.description,
          type: parsed.data.type,
          ...(parsed.data.type === FieldType.SELECT
            ? {
                fieldSelect: {
                  update: {
                    isMulti: parsed.data.isMulti,
                    fieldSelectOptions: {
                      upsert: parsed.data.options?.map((option) => ({
                        where: { id: option.id || 0 },
                        create: {
                          label: option.label,
                          price: option.price,
                        },
                        update: {
                          label: option.label,
                          price: option.price,
                        },
                      })),
                      deleteMany: parsed.data.deleteOptionIds?.map((id) => ({ id })) || [],
                    },
                  },
                },
              }
            : parsed.data.type === FieldType.NUMBER
            ? {
                fieldNumber: {
                  update: {
                    fieldNumberRanges: {
                      upsert: parsed.data.options?.map((option) => ({
                        where: { id: option.id || 0 }, // MEMO: undefinedを渡すとエラーになるのであり得ない数を入れる
                        create: {
                          gte: option.gte || null,
                          lt: option.lt || null,
                          price: option.price,
                        },
                        update: {
                          gte: option.gte || null,
                          lt: option.lt || null,
                          price: option.price,
                        },
                      })),
                      deleteMany: parsed.data.deleteOptionIds?.map((id) => ({ id })) || [],
                    },
                  },
                },
              }
            : parsed.data.type === FieldType.CONDITION
            ? {
                fieldCondition: {
                  update: {
                    fieldConditionBranches: {
                      upsert: parsed.data.options?.map((option) => ({
                        where: { id: option.id || 0 }, // MEMO: undefinedを渡すとエラーになるのであり得ない数を入れる
                        create: {
                          label: option.label,
                        },
                        update: {
                          label: option.label,
                        },
                      })),
                      deleteMany: parsed.data.deleteOptionIds?.map((id) => ({ id })) || [],
                    },
                  },
                },
              }
            : undefined),
        },
        include: {
          fieldConditionBranches: true,
          ...(parsed.data.type === FieldType.SELECT && {
            fieldSelect: {
              include: {
                fieldSelectOptions: true,
              },
            },
          }),
          ...(parsed.data.type === FieldType.NUMBER && {
            fieldNumber: {
              include: {
                fieldNumberRanges: true,
              },
            },
          }),
          ...(parsed.data.type === FieldType.CONDITION && {
            fieldCondition: {
              include: {
                fieldConditionBranches: true,
              },
            },
          }),
        },
      });

      return updateField;
    });

    return NextResponse.json(updateField);
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
    });
  }
}

/**
 * フィールド削除
 */
export async function DELETE(_request: Request, { params }: { params: { formId: string; fieldId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  await authForm(session.user.id, Number(params.formId));

  try {
    await prisma.field.deleteMany({
      where: { id: Number(params.fieldId), formId: Number(params.formId) },
    });

    return NextResponse.json({ result: 'ok' });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}
