import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { putSchema } from '@/app/api/admin/form/[formId]/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authForm } from '@/utils/auth/resources/form';

/**
 * フォーム取得
 */
export async function GET(_request: Request, { params }: { params: { formId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  try {
    // TODO: zennで書いてみる
    const form = await prisma.form.findFirstOrThrow({
      where: { id: Number(params.formId), userId: session.user.id },
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

    return NextResponse.json(form, { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}

/**
 * フォーム更新
 */
export async function PUT(req: Request, { params }: { params: { formId: string } }) {
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

  const form = await prisma.$transaction(async (tx) => {
    // TODO: zennで書いてみる
    const form = await tx.form.update({
      where: { id: Number(params.formId) },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        profileId: parsed.data.profileId,
      },
    });

    return form;
  });

  return NextResponse.json(form, {
    status: 200,
  });
}

/**
 * フォーム削除
 */
export async function DELETE(_request: Request, { params }: { params: { formId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  await authForm(session.user.id, Number(params.formId));

  await prisma.form.delete({
    where: {
      id: Number(params.formId),
    },
  });

  return NextResponse.json({ result: 'ok' });
}
