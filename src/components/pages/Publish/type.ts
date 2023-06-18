import type { Field, FieldNumber, FieldNumberRange, FieldSelectOption, Form, Prisma } from '@prisma/client';

export type FormData = Form & {
  fields: (Field & {
    fieldSelect:
      | (Prisma.FieldSelect & {
          fieldSelectOptions: FieldSelectOption[];
        })
      | null;
    fieldNumber:
      | (FieldNumber & {
          fieldNumberRanges: FieldNumberRange[];
        })
      | null;
  })[];
};
