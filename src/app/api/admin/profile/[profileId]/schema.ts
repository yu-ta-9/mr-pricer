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
  // TODO: numberで良いのでは？
  deleteProfileLinksIds: z.array(z.string().transform((v) => Number(v))).optional(),
});
