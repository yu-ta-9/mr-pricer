import { postSchema } from '@/app/api/p/result/schema';
import { prisma } from '@/lib/prisma';

/**
 * 見積もり計算API
 */
export async function POST(req: Request) {
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

  const { friendlyKey, fields } = parsed.data;

  try {
    // TODO: 4系のエラーにする
    const form = await prisma.form.findUniqueOrThrow({
      where: {
        friendlyKey,
      },
      include: {
        fields: {
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
        },
      },
    });

    const sum = fields.reduce((sum, field) => {
      const formField = form.fields.find((f) => f.id === field.id);
      if (formField === undefined) {
        return sum;
      }

      switch (formField.type) {
        case 'SELECT':
          return sum + (formField.fieldSelect?.fieldSelectOptions.find((o) => o.id === field.value)?.price || 0);
        case 'NUMBER':
          return (
            sum +
            (formField.fieldNumber?.fieldNumberRanges.find((r) => {
              if (r.gte === null && r.lt === null) return false;

              // MEMO: 仕様上、gteとltが同時にnullになることはないのでキャストする
              if (r.gte === null) return field.value < (r as any).lt;

              if (r.lt === null) return r.gte <= field.value;

              return r.gte <= field.value && field.value < r.lt;
            })?.price || 0)
          );
        default:
          return sum;
      }
    }, 0);

    return new Response(JSON.stringify({ result: sum }), {
      status: 200,
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        message: 'Internal Server Error',
      }),
      {
        status: 500,
      },
    );
  }
}
