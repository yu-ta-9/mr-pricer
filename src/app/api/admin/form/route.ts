import { FieldType } from '@prisma/client';
import cryptoRandomString from 'crypto-random-string';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { FORM_COUNT_LIMIT } from '@/utils/validation/form';

/**
 * フォーム一覧取得
 * @returns
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  const forms = await prisma.form.findMany({ where: { userId: session.user.id } });
  return NextResponse.json(forms);
}

/**
 * フォーム作成
 */
export async function POST(_req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    return new Response(JSON.stringify({ message: 'You must be logged in.' }), {
      status: 401,
    });
  }

  try {
    const formCount = await prisma.form.count({ where: { userId: session.user.id } });
    if (formCount >= FORM_COUNT_LIMIT) {
      throw new Error('フォームの作成上限に達しました。');
    }

    const form = await prisma.form.create({
      data: {
        userId: session.user.id,
        name: '見積もりフォーム',
        description: '見積もりを行います。',
        friendlyKey: generateFriendlyKey(),
        fields: {
          create: {
            type: FieldType.SELECT,
            name: '設問1',
            description: '',
            fieldSelect: {
              create: {},
            },
          },
        },
      },
    });

    return new Response(JSON.stringify(form), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e }), {
      status: 500,
    });
  }
}

const generateFriendlyKey = () => {
  return cryptoRandomString({ length: 16, type: 'alphanumeric' });
};
