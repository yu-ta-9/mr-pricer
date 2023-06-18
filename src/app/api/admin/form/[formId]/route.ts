import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { putSchema } from '@/app/api/admin/form/[formId]/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    // 認証チェック込み
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

    console.log('test', form);

    return NextResponse.json(form);
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

  // TODO: zennで書いてみる
  // 認証チェック込み
  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      forms: {
        update: {
          where: { id: Number(params.formId) },
          data: {
            name: parsed.data.name,
            description: parsed.data.description,
          },
        },
      },
    },
    include: {
      forms: {
        where: {
          id: Number(params.formId),
        },
      },
    },
  });

  return NextResponse.json(user.forms[0]);
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

  // TODO: zennで書いてみる
  // 認証チェック込み
  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      forms: {
        delete: {
          id: Number(params.formId),
        },
      },
    },
  });

  return NextResponse.json({ result: 'ok' });
}
