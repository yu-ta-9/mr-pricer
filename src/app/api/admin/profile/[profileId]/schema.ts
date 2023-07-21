import { z } from 'zod';

import { PROFILE_LINK_COUNT_LIMIT } from '@/utils/validation/profile';

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
    .max(PROFILE_LINK_COUNT_LIMIT)
    .optional(),
  // TODO: numberで良いのでは？
  deleteProfileLinksIds: z.array(z.string().transform((v) => Number(v))).optional(),
});
