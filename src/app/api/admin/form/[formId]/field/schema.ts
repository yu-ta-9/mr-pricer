import { FieldType } from '@prisma/client';
import { z } from 'zod';

export const postSchema = z.object({
  type: z.nativeEnum(FieldType),
  parentConditionId: z.number().gte(1).optional(),
});
