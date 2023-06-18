import type { Form, Field, FieldSelect, FieldSelectOption, FieldNumber, FieldNumberRange } from '@prisma/client';

/**
 * フォームのhook-form向け型定義
 */
export type FormForm = Form & {
  fields: (Field & {
    fieldSelect:
      | (FieldSelect & {
          fieldSelectOptions:
            | FieldSelectOption[]
            | (Omit<FieldSelectOption, 'id' | 'fieldSelectId' | 'createdAt' | 'updatedAt'> &
                Partial<Pick<FieldSelectOption, 'id' | 'fieldSelectId' | 'createdAt' | 'updatedAt'>>)[]; // 一部をオプショナルに変更
        })
      | null;
    fieldNumber:
      | (FieldNumber & {
          fieldNumberRanges:
            | FieldNumberRange[]
            | (Omit<FieldNumberRange, 'id' | 'fieldNumberId' | 'createdAt' | 'updatedAt'> &
                Partial<Pick<FieldNumberRange, 'id' | 'fieldNumberId' | 'createdAt' | 'updatedAt'>>)[]; // 一部をオプショナルに変更;
        })
      | null;
  })[];
};
