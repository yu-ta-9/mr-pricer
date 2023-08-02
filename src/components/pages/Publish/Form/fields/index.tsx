import { memo } from 'react';

import { ConditionField } from '@/components/pages/Publish/Form/fields/ConditionField';
import { NumberField } from '@/components/pages/Publish/Form/fields/NumberField';
import { SelectField } from '@/components/pages/Publish/Form/fields/SelectField';

import type { FormData } from '@/components/pages/Publish/type';
import type { FC } from 'react';

type Props = { field: FormData['fields'][number]; index: number; conditionFieldIndexes: number[] };

/**
 * 再起的にhook-formの型付けを利用するためにキャストを活用する
 * ref: https://wanago.io/2022/05/16/recursive-dynamic-forms-react-hook-form-typescript/
 */
const getFieldNamePrefix = (index: number, conditionFieldIndexes: number[]): `fields.${number}` => {
  if (conditionFieldIndexes.length === 0) {
    return `fields.${index}`;
  }

  let name = '';
  conditionFieldIndexes.forEach((fieldIndex) => {
    name += `fields.${fieldIndex}`;
  });
  name += `.fields.${index}`;
  return name as `fields.${number}`;
};

const _Field: FC<Props> = ({ field, index, conditionFieldIndexes }) => {
  switch (field.type) {
    case 'SELECT':
      return (
        <SelectField
          id={field.id}
          name={getFieldNamePrefix(index, conditionFieldIndexes)}
          label={field.name}
          options={
            field.fieldSelect?.fieldSelectOptions.map((option) => ({
              label: option.label,
              value: String(option.id),
            })) || []
          }
          isMulti={field.fieldSelect?.isMulti || false}
        />
      );
    case 'NUMBER':
      return <NumberField id={field.id} name={getFieldNamePrefix(index, conditionFieldIndexes)} label={field.name} />;
    case 'CONDITION':
      return (
        <ConditionField
          index={index}
          field={field}
          name={getFieldNamePrefix(index, conditionFieldIndexes)}
          conditionFieldIndexes={conditionFieldIndexes}
        />
      );
  }
};

export const Field = memo(_Field);
