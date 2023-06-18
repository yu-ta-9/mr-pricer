import type { Form } from '@prisma/client';

/**
 * 公開URLを取得する
 * @param form
 * @returns string
 */
export const getPublishUrl = (form: Form) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}/p/${form.friendlyKey}`;
};
