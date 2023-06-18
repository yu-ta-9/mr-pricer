import { FieldType } from '@prisma/client';
import { z } from 'zod';

export const postSchema = z.object({
  type: z.nativeEnum(FieldType),
});
