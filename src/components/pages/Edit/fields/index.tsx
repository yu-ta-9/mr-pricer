import { ArrowDownIcon, ArrowUpIcon, TrashIcon } from '@heroicons/react/24/solid';
import { FieldType } from '@prisma/client';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { NumberField } from '@/components/pages/Edit/fields/NumberField';
import { SelectField } from '@/components/pages/Edit/fields/SelectField';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';

import type { FormForm } from '@/components/pages/Edit/type';
import type { FC } from 'react';

type Props = { type: FieldType; index: number; onDelete: (index: number) => void };

const getField = (type: FieldType, index: number) => {
  switch (type) {
    case 'SELECT':
      return <SelectField index={index} />;
    case 'NUMBER':
      return <NumberField index={index} />;
  }
};

const getFieldName = (type: FieldType) => {
  switch (type) {
    case 'SELECT':
      return '選択入力';
    case 'NUMBER':
      return '数値入力';
  }
};

const _Field: FC<Props> = ({ type, index, onDelete }) => {
  const { getValues, setValue } = useFormContext<FormForm>();

  const handleUpdate = async () => {
    try {
      const fieldValue = getValues(`fields.${index}`);
      const { name, description, type, fieldSelect, fieldNumber } = fieldValue;
      const options =
        type === FieldType.SELECT
          ? fieldSelect?.fieldSelectOptions.map((option) => ({
              id: option.id,
              label: option.label,
              price: option.price,
            }))
          : fieldNumber?.fieldNumberRanges.map((range) => ({
              id: range.id,
              price: range.price,
              gte: range.gte,
              lt: range.lt,
            }));

      const res = await fetch(`/api/admin/form/${getValues('id')}/field/${getValues(`fields.${index}.id`)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          name,
          description,
          options,
        }),
      });

      if (!res.ok) throw new Error('error');

      // MEMO: 各オプションにidを付与し、増分判定から除外できるようにする
      const data = await res.json();
      if (fieldValue.type === FieldType.SELECT) {
        const newFieldSelectOptionValue = fieldValue.fieldSelect!.fieldSelectOptions.map((option, i) => ({
          ...option,
          id: data.fieldSelect.fieldSelectOptions[i].id,
        }));

        setValue(`fields.${index}.fieldSelect.fieldSelectOptions`, newFieldSelectOptionValue);
      }

      if (fieldValue.type === FieldType.NUMBER) {
        const newFieldSelectOptionValue = fieldValue.fieldNumber!.fieldNumberRanges.map((range, i) => ({
          ...range,
          id: data.fieldNumberRange.fieldNumberRanges[i].id,
        }));

        setValue(`fields.${index}.fieldNumber.fieldNumberRanges`, newFieldSelectOptionValue);
      }

      window.alert('フィールドを更新しました');
    } catch (err) {
      console.error(err);
      window.alert('エラーが発生しました');
    }
  };

  return (
    <div className='relative flex flex-col w-full gap-4 p-4 border-2 rounded border-primary'>
      {getField(type, index)}

      <div className='absolute top-0 left-0 flex items-center gap-2 -translate-x-[16px] -translate-y-1/2'>
        <div className='flex items-center justify-center w-8 h-8 text-white rounded-full bg-primary'>{index + 1}</div>

        <p className='pl-2 pr-2 font-semibold bg-white'>{getFieldName(type)}</p>
      </div>

      <Button theme='primary' type='button' onClick={handleUpdate}>
        更新
      </Button>

      <div className='absolute top-0 right-0 flex items-center gap-2 text-white translate-x-[16px] -translate-y-1/2 rounded-full'>
        <IconButton
          bgFill
          theme='primary'
          svgComponent={(className) => <ArrowUpIcon className={className} />}
          onClick={() => {}}
        />
        <IconButton
          bgFill
          theme='primary'
          svgComponent={(className) => <ArrowDownIcon className={className} />}
          onClick={() => {}}
        />
        <IconButton
          bgFill
          theme='danger'
          svgComponent={(className) => <TrashIcon className={className} />}
          onClick={() => onDelete(index)}
        />
      </div>
    </div>
  );
};

export const Field = memo(_Field);
