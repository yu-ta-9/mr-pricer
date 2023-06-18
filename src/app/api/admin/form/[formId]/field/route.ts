import { FieldType } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { postSchema } from '@/app/api/admin/form/[formId]/field/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
    // 認可チェック
    const form = await prisma.form.findFirstOrThrow({
      where: {
        id: Number(params.formId),
        userId: session.user.id,
      },
    });

    const field = await prisma.field.create({
      data: {
        formId: form.id,
        name: '設問名',
        description: '',
        type: type,
        ...(type === FieldType.SELECT
          ? {
              fieldSelect: {
                create: {},
              },
            }
          : {
              fieldNumber: {
                create: {},
              },
            }),
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
