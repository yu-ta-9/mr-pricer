import { z } from 'zod';

// TODO: 使う時に復活
// const selectFieldSchema = z.object({
//   id: z.number(),
//   type: z.enum([FieldType.SELECT]),
//   value: z.number(),
// });

// const numberFieldSchema = z.object({
//   id: z.number(),
//   type: z.enum([FieldType.NUMBER]),
//   value: z.number(),
// });

export const postSchema = z.object({
  friendlyKey: z.string(),
  fields: z.array(
    z.object({
      id: z.number(),
      value: z.number(),
    }),
  ),
});

export type postSchemaType = z.infer<typeof postSchema>;
