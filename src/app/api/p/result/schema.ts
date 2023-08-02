import { z } from 'zod';

/**
 * 再起的なzod schema
 * ref: https://github.com/colinhacks/zod#recursive-types
 */
const baseFieldSchema = z.object({
  id: z.number({ required_error: '必須です', invalid_type_error: '必須です' }),
  value: z.union([
    z.number({ required_error: '必須です', invalid_type_error: '必須です' }),
    z.array(z.number({ required_error: '必須です', invalid_type_error: '必須です' })).min(1, '1つ以上選択してください'),
  ]),
});
type Field = z.infer<typeof baseFieldSchema> & {
  fields?: Field[];
};
const fieldSchema: z.ZodType<Field> = baseFieldSchema.extend({
  fields: z.lazy(() => fieldSchema.array()).optional(),
});
export type FieldSchemaType = z.infer<typeof fieldSchema>;

export const postSchema = z.object({
  friendlyKey: z.string().nonempty({ message: '必須です' }),
  fields: z.array(fieldSchema),
});

export type postSchemaType = z.infer<typeof postSchema>;
