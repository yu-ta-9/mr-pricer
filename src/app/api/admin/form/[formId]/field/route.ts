import { FieldType } from '@prisma/client';
import { getServerSession } from 'next-auth';

import { postSchema } from '@/app/api/admin/form/[formId]/field/schema';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { authForm } from '@/utils/auth/resources/form';

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
    const field = await prisma.field.create({
      data: {
        formId: Number(params.formId),
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
