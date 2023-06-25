import { z } from 'zod';

const schema = z.object({
  friendlyKey: z.string(),
});

/**
 * 見積もり計算API
 */
export async function POST(req: Request) {
  const parsed = schema.safeParse(req);
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

  // const { name, description, fields } = parsed.data;

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
  });
}
