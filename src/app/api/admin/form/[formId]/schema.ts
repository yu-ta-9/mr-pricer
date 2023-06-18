import { z } from 'zod';

export const putSchema = z.object({
  name: z.string(),
  description: z.string(),
});
