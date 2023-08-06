import { Prisma } from '@prisma/client';

export const formClientSelectCondition = {
  select: {
    id: true,
    profileId: true,
    name: true,
    description: true,
    friendlyKey: true,
    profile: {
      include: {
        profileLinks: true,
        profileTheme: true,
      },
    },
    fields: {
      include: {
        fieldConditionBranches: {
          select: {
            fieldConditionBranchId: true,
          },
        },
        fieldSelect: {
          select: {
            id: true,
            fieldId: true,
            isMulti: true,
            fieldSelectOptions: {
              select: {
                id: true,
                fieldSelectId: true,
                label: true,
                price: true,
              },
            },
          },
        },
        fieldNumber: {
          select: {
            id: true,
            fieldId: true,
            fieldNumberRanges: {
              select: {
                id: true,
                fieldNumberId: true,
                gte: true,
                lt: true,
                price: true,
              },
            },
          },
        },
        fieldCondition: {
          select: {
            id: true,
            fieldId: true,
            fieldConditionBranches: {
              select: {
                id: true,
                fieldConditionId: true,
                label: true,
              },
            },
          },
        },
      },
    },
  },
};
const formClient = Prisma.validator<Prisma.FormArgs>()(formClientSelectCondition);
export type FormClient = Prisma.FormGetPayload<typeof formClient>;
export type ParsedField = FormClient['fields'][number] & { fields: ParsedField[] } & {
  fieldSelect: (NonNullable<FormClient['fields'][number]['fieldSelect']> & { deleteOptionIds?: number[] }) | null;
  fieldNumber: (NonNullable<FormClient['fields'][number]['fieldNumber']> & { deleteOptionIds?: number[] }) | null;
};
/** 最終的なフロントでのデータの持ち方 */
export type ParsedFormClient = Omit<FormClient, 'fields'> & { fields: ParsedField[] };

export type FormData = ParsedFormClient;
