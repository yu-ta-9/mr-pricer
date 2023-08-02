import { z } from 'zod';

export const postSchema = z.object({
  label: z.string(),
});
