import { FieldType } from '@prisma/client';
import { z } from 'zod';

export const putSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal(FieldType.SELECT),
    name: z.string(),
    description: z.string().optional().nullable(), // TODO: 不要かも
    options: z
      .array(z.object({ id: z.number().int().optional(), label: z.string(), price: z.number().int().gte(0) }))
      .optional(),
  }),
  z.object({
    type: z.literal(FieldType.NUMBER),
    name: z.string(),
    description: z.string().optional().nullable(), // TODO: 不要かも
    options: z
      .array(
        z.object({
          id: z.number().int().optional(),
          gte: z.number().int().gte(0),
          lt: z.number().int().gte(0),
          price: z.number().int().gte(0),
        }),
      )
      .optional(),
  }),
]);
