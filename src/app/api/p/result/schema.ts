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
  friendlyKey: z.string().nonempty({ message: '必須です' }),
  fields: z.array(
    z.object({
      id: z.number({ required_error: '必須です', invalid_type_error: '必須です' }),
      value: z.number({ required_error: '必須です', invalid_type_error: '必須です' }),
    }),
  ),
});

export type postSchemaType = z.infer<typeof postSchema>;
