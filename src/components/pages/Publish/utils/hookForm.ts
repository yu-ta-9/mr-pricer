import type { postSchemaType, FieldSchemaType } from '@/app/api/p/result/schema';
import type { ParsedFormClient } from '@/components/pages/form/Edit/type';
import type { FieldErrors } from 'react-hook-form';

/**
 * ネストされたエラー内容を取り出す（公開画面向け）
 */
export const getRecursiveError = (
  name: `fields.${number}`,
  errors: FieldErrors<postSchemaType>,
): FieldErrors<FieldSchemaType> | undefined => {
  if (Object.keys(errors).length === 0) return;

  const keys = name.split('.');
  // MEMO: 無理矢理キャストする
  let errorObj: Record<string, any> = errors;

  for (const key of keys) {
    if (!Number.isNaN(Number(key))) {
      errorObj = errorObj[Number(key)];
    } else {
      errorObj = errorObj[key];
    }

    // MEMO: undefinedとなった時点で即返却する、エラーとなってしまうため
    if (errorObj === undefined) {
      return undefined;
    }
  }

  return errorObj;
};

/**
 * ネストされたエラー内容を取り出す（管理画面向け）
 */
export const getRecursiveErrorForAdmin = (
  name: `fields.${number}`,
  errors: FieldErrors<ParsedFormClient>,
): FieldErrors<ParsedFormClient['fields'][number]> | undefined => {
  if (Object.keys(errors).length === 0) return;

  const keys = name.split('.');
  // MEMO: 無理矢理キャストする
  let errorObj: Record<string, any> = errors;

  for (const key of keys) {
    if (!Number.isNaN(Number(key))) {
      errorObj = errorObj[Number(key)];
    } else {
      errorObj = errorObj[key];
    }

    // MEMO: undefinedとなった時点で即返却する、エラーとなってしまうため
    if (errorObj === undefined) {
      return undefined;
    }
  }

  return errorObj;
};
