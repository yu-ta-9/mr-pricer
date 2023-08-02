import { Edit } from '@/components/pages/form/Edit';
import { prisma } from '@/lib/prisma';
import { getAuthenticateSession } from '@/utils/server/auth';

import type { FormClient, ParsedFormClient } from '@/components/pages/form/Edit/type';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'フォーム編集',
  description: 'フォーム編集',
};

const EditPage = async ({ params }: { params: { formId: string } }) => {
  const session = await getAuthenticateSession();

  try {
    const user = await prisma.user.findUniqueOrThrow({ where: { id: session.user!.id } });
    const form = await prisma.form.findFirstOrThrow({
      where: { id: Number(params.formId), userId: user.id },
      select: {
        id: true,
        profileId: true,
        name: true,
        description: true,
        friendlyKey: true,
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
                  orderBy: {
                    id: 'asc',
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
                  orderBy: {
                    id: 'asc',
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
                  orderBy: {
                    id: 'asc',
                  },
                },
              },
            },
          },
          orderBy: {
            id: 'asc',
          },
        },
      },
    });
    const profiles = await prisma.profile.findMany({ where: { userId: user.id }, orderBy: { id: 'asc' } });

    const formData = {
      ...form,
      fields: sortFieldsByCondition(form.fields),
    };

    return <Edit formData={formData} profilesData={profiles} />;
  } catch (err) {
    return {
      redirect: {
        destination: '/not-found',
        statusCode: 404,
      },
    };
  }
};

export default EditPage;

/**
 * 条件分岐によるネスト表現に変換する
 */
const sortFieldsByCondition = (fields: FormClient['fields']): ParsedFormClient['fields'] => {
  const originFields = fields.concat();
  // TODO: 抽出の度に元の配列から削除するようにしたい

  // まずは１段のみ考える
  const parentFields = originFields
    .filter((field) => field.parentFieldConditionId === null)
    .map((field) => ({ ...field, fields: [] as unknown as ParsedFormClient['fields'] }));
  const childFields = originFields
    .filter((field) => field.parentFieldConditionId !== null)
    .map((field) => ({ ...field, fields: [] as unknown as ParsedFormClient['fields'] }));

  // 親の条件分岐フィールドに対応する子フィールドを追加する
  childFields.forEach((childField) => {
    // 途中でbreakするためにfor-ofを使う、indexを取るためにentriesを挟む
    // ref: https://qiita.com/TakahiRoyte/items/dca532dd64bc782ad849
    for (const [index, parentField] of Object.entries(parentFields)) {
      const isParent = childField.parentFieldConditionId === parentField.fieldCondition?.id;

      if (isParent) {
        parentFields[Number(index)].fields = [...parentFields[Number(index)].fields, childField];
        break;
      }
    }
  });

  return parentFields;
};
