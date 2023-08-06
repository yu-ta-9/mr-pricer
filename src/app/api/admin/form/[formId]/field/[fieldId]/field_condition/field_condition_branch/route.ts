import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * 条件フィールド詳細取得
 */
export async function GET(_request: Request, { params }: { params: { formId: string; fieldId: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  try {
    const form = await prisma.form.findFirstOrThrow({
      where: { id: Number(params.formId), userId: session.user.id },
      include: {
        fields: {
          where: { id: Number(params.fieldId) },
          include: {
            fieldCondition: {
              include: {
                fieldConditionBranches: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(form.fields[0].fieldCondition?.fieldConditionBranches, { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}

// TODO: 謎の容量制限にかかったのでコメントアウトする
// /**
//  * 条件フィールド登録
//  */
// export async function POST(req: Request, { params }: { params: { formId: string; fieldId: string } }) {
//   const session = await getServerSession(authOptions);
//   if (!session || session.user === undefined) {
//     return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
//       status: 401,
//     });
//   }

//   const reqJson = await req.json();
//   const parsed = postSchema.safeParse(reqJson);
//   if (!parsed.success) {
//     return new Response(
//       JSON.stringify({
//         message: 'Bad Request',
//         issues: JSON.parse(parsed.error.message),
//       }),
//       {
//         status: HTTP_STATUS_CODE.BAD_REQUEST,
//       },
//     );
//   }

//   try {
//     const form = await prisma.form.findFirstOrThrow({
//       where: { id: Number(params.formId), userId: session.user.id },
//       include: {
//         fields: {
//           where: { id: Number(params.fieldId) },
//           include: {
//             fieldCondition: true,
//           },
//         },
//       },
//     });

//     const fieldConditionBranch = await prisma.fieldConditionBranch.create({
//       data: {
//         fieldConditionId: form.fields[0].fieldCondition?.id || 0,
//         label: parsed.data.label,
//       },
//     });

//     return NextResponse.json(fieldConditionBranch, { status: 200 });
//   } catch (e) {
//     return new Response(JSON.stringify({ error: e }), {
//       status: 500,
//     });
//   }
// }
