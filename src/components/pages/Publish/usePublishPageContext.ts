import { useCallback, useContext } from 'react';

import { PublishPageContext } from '@/components/pages/Publish/context';

import type { postSchemaType } from '@/app/api/p/result/schema';
import type { FormData } from '@/components/pages/Publish/type';

/**
 * 公開画面のcontextを使用するcustom hook
 */
export const usePublishPageContext = () => {
  const { ...context } = useContext(PublishPageContext);

  const parsedCalculate = useCallback(
    (value: postSchemaType) => calculate(value, context.formData),
    [context.formData],
  );

  return {
    ...context,
    calculate: parsedCalculate,
  };
};

/**
 * 見積もり計算
 * @param value
 */
const calculate = (value: postSchemaType, formData?: FormData): number => {
  if (formData === undefined) return 0;

  console.log({ value, formData });

  const sum = value.fields.reduce((sum, field) => {
    // MEMO: DBからの情報をマッピング
    const formFieldData = formData.fields.find((f) => f.id === field.id);
    if (formFieldData === undefined) {
      return sum;
    }

    return sum + calculateByField(field, formFieldData);
  }, 0);

  return sum;
};

/**
 * field毎の計算
 */
const calculateByField = (
  fieldValue: postSchemaType['fields'][number],
  fieldData: FormData['fields'][number],
): number => {
  switch (fieldData.type) {
    case 'SELECT': {
      // 複数選択
      if (fieldData.fieldSelect?.isMulti) {
        const value = fieldValue.value as number[];
        return (
          fieldData.fieldSelect?.fieldSelectOptions.reduce((sum, option) => {
            if (value.includes(option.id)) {
              return sum + option.price;
            }

            return sum;
          }, 0) || 0
        );
      }

      // 単数選択
      const value = fieldValue.value as number;
      return fieldData.fieldSelect?.fieldSelectOptions.find((o) => o.id === value)?.price || 0;
    }
    case 'NUMBER': {
      const value = fieldValue.value as number;
      return (
        fieldData.fieldNumber?.fieldNumberRanges.find((r) => {
          if (r.gte === null && r.lt === null) return false;

          // MEMO: 仕様上、gteとltが同時にnullになることはないのでキャストする
          if (r.gte === null) return fieldValue.value < (r as any).lt;

          if (r.lt === null) return r.gte <= value;

          return r.gte <= value && value < r.lt;
        })?.price || 0
      );
    }
    case 'CONDITION': {
      if (fieldValue.fields === undefined) return 0;

      const value = fieldValue.value as number;

      return fieldValue.fields.reduce((sum, field) => {
        // MEMO: DBからの情報をマッピング
        const nestedFieldData = fieldData.fields.find((f) => f.id === field.id);
        if (nestedFieldData === undefined) {
          // 見つからない場合
          return sum;
        }

        if (!nestedFieldData.fieldConditionBranches.map((branch) => branch.fieldConditionBranchId).includes(value)) {
          // 選択された条件に沿わない場合
          return sum;
        }

        return sum + calculateByField(field, nestedFieldData);
      }, 0);
    }
    default:
      return 0;
  }
};
