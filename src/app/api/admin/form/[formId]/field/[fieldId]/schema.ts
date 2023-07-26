import { FieldType } from '@prisma/client';
import { z } from 'zod';

import { FIELD_NUMBER_RANGE_LIMIT, FIELD_SELECT_OPTION_LIMIT } from '@/utils/validation/field';

export const putSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(FieldType.SELECT),
    name: z.string(),
    description: z.string().optional().nullable(), // TODO: 不要かも
    isMulti: z.boolean(),
    options: z
      .array(z.object({ id: z.number().int().optional(), label: z.string(), price: z.number().int().gte(0) }))
      .min(1)
      .max(FIELD_SELECT_OPTION_LIMIT)
      .optional(),
    deleteOptionIds: z.array(z.number()).optional(),
  }),
  z.object({
    type: z.literal(FieldType.NUMBER),
    name: z.string(),
    description: z.string().optional().nullable(), // TODO: 不要かも
    options: z
      .array(
        // TODO: 調整する？
        z.object({
          id: z.number().int().optional(),
          gte: z.number().int().gte(0).optional(),
          lt: z.number().int().gte(0).optional(),
          price: z.number().int().gte(0),
        }),
      )
      .min(2) // MEMO: 仕様上下限を2としている
      .max(FIELD_NUMBER_RANGE_LIMIT)
      .optional(),
    deleteOptionIds: z.array(z.number()).optional(),
  }),
]);

export type putSchemaType = z.infer<typeof putSchema>;
