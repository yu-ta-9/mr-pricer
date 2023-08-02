import { cache } from 'react';

import { Publish } from '@/components/pages/Publish';
import { prisma } from '@/lib/prisma';
import { ToastProvider } from '@/providers/ToastProvider';
import { getS3PresignedUrl } from '@/utils/aws/s3';

import type { FormClient, ParsedFormClient } from '@/components/pages/Publish/type';
import type { Metadata } from 'next';

type Props = {
  params: {
    friendlyKey: string;
  };
};

const getForm = cache(async (friendlyKey: string) => {
  const form = await prisma.form.findFirstOrThrow({
    where: { friendlyKey },
    select: {
      id: true,
      userId: true,
      profileId: true,
      name: true,
      description: true,
      friendlyKey: true,
      profile: {
        include: {
          profileLinks: true,
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

  return form;
});

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const form = await getForm(params.friendlyKey);
  return { title: form.name, description: form.description || form.name };
}

const FriendlyKey = async ({ params }: Props) => {
  const form = await getForm(params.friendlyKey);

  const formData = {
    ...form,
    fields: sortFieldsByCondition(form.fields),
  };

  let profileIconUrl;
  if (form.profile !== null && form.profile.iconKey !== null) {
    profileIconUrl = await getS3PresignedUrl(form.userId, String(form.profile.id), form.profile.iconKey);
  }

  return (
    <ToastProvider>
      <Publish formData={formData} profileIconUrl={profileIconUrl} />
    </ToastProvider>
  );
};

export default FriendlyKey;

/**
 * 条件分岐によるネスト表現に変換する
 * TODO: 編集画面と同じロジックなので統一したい
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
