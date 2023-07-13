import { FieldType } from '@prisma/client';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { putSchema } from '@/app/api/admin/form/[formId]/field/[fieldId]/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authForm } from '@/utils/auth/resources/form';

/**
 * フィールド取得
 * TODO: 不要？
 */
export async function GET(_request: Request, { params }: { params: { formId: string; fieldId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  await authForm(session.user.id, Number(params.formId));

  try {
    // TODO: zennで書いてみる
    const field = await prisma.field.findFirstOrThrow({
      where: {
        id: Number(params.fieldId),
        formId: Number(params.formId),
      },
    });

    return NextResponse.json(field);
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}

/**
 * フィールド更新
 */
export async function PUT(req: Request, { params }: { params: { formId: string; fieldId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
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
        status: 400,
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

    // TODO: zennで書いてみる

    const updateField = await prisma.field.update({
      where: { id: field.id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        type: parsed.data.type,
        ...(parsed.data.type === FieldType.SELECT
          ? {
              fieldSelect: {
                update: {
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
                  },
                },
              },
            }
          : {
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
                  },
                },
              },
            }),
      },
      include: {
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
      },
    });

    return NextResponse.json(updateField);
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
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

  // TODO: zennで書いてみる
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

/** ↓ TODO: トランザクションver */

// const updateFieldSelectOptions =
//   parsed.data.type === FieldType.SELECT
//     ? parsed.data.options?.map((option) =>
//         prisma.fieldSelectOption.upsert({
//           where: {
//             id: option.id || 0,
//           },
//           create: {
//             fieldSelectId: field.fieldSelect!.id,
//             label: option.label,
//             price: option.price,
//           },
//           update: {
//             fieldSelectId: field.fieldSelect!.id,
//             label: option.label,
//             price: option.price,
//           },
//         }),
//       ) || []
//     : [];

// const updateFieldNumberRanges =
//   parsed.data.type === FieldType.NUMBER
//     ? parsed.data.options?.map((option) =>
//         prisma.fieldNumberRange.upsert({
//           where: {
//             id: option.id || 0,
//           },
//           create: {
//             fieldNumberId: field.fieldNumber!.id,
//             price: option.price,
//             gte: option.gte,
//             lt: option.lt,
//           },
//           update: {
//             fieldNumberId: field.fieldNumber!.id,
//             price: option.price,
//             gte: option.gte,
//             lt: option.lt,
//           },
//         }),
//       ) || []
//     : [];

// console.log(updateField, updateFieldSelectOptions, field.fieldSelect!.id, updateFieldNumberRanges);

// const result = await prisma.$transaction([updateField, ...updateFieldSelectOptions, ...updateFieldNumberRanges]);
