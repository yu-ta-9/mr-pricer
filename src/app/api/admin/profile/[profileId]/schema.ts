import { z } from 'zod';

import { PROFILE_LINK_COUNT_LIMIT } from '@/utils/validation/profile';

/**
 * ref: https://github.com/colinhacks/zod/issues/604#issuecomment-1108756297
 */
const colorValidator = z.string().min(4).max(9).regex(/^#/);

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
  profileTheme: z.object({
    primaryColor: colorValidator,
    formBackgroundColor: colorValidator,
    contentBackgroundColor: colorValidator,
    textColor: colorValidator,
    borderColor: colorValidator,
  }),
});
