import { z } from 'zod';

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

export const postSchema = z.object({
  iconFile: z
    .custom<File>()
    .refine((file) => file !== undefined, { message: '必須です' })
    .refine((file) => file?.length !== 0, { message: '必須です' })
    .refine((file) => file?.size < 500000, { message: 'ファイルサイズは最大5MBです' })
    .refine((file) => IMAGE_TYPES.includes(file?.type), {
      message: 'jpg/png/gifのみ可能です',
    }),
});
