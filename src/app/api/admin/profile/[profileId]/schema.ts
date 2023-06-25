import { z } from 'zod';

export const putSchema = z.object({
  name: z.string(),
  content: z.string(),
  profileLinks: z
    .array(
      z.object({
        id: z.number().optional(),
        label: z.string(),
        url: z.string().url(),
      }),
    )
    .optional(),
  deleteProfileLinksIds: z.array(z.string().transform((v) => Number(v))).optional(),
});
