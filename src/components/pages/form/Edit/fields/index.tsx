import { TrashIcon } from '@heroicons/react/24/solid';
import { FieldType } from '@prisma/client';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';

import { NumberField } from '@/components/pages/form/Edit/fields/NumberField';
import { SelectField } from '@/components/pages/form/Edit/fields/SelectField';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { useToast } from '@/hooks/useToast';

import type { putSchemaType } from '@/app/api/admin/form/[formId]/field/[fieldId]/schema';
import type { FormForm } from '@/components/pages/form/Edit/type';
import type { FC } from 'react';

type Props = { type: FieldType; index: number; onDelete: (index: number) => void };

const getField = (type: FieldType, index: number) => {
  switch (type) {
    case FieldType.SELECT:
      return <SelectField index={index} />;
    case FieldType.NUMBER:
      return <NumberField index={index} />;
  }
};

const getFieldName = (type: FieldType) => {
  switch (type) {
    case FieldType.SELECT:
      return '選択入力';
    case FieldType.NUMBER:
      return '数値入力';
  }
};

const _Field: FC<Props> = ({ type, index, onDelete }) => {
  const { openToast } = useToast();
  const { getValues, setValue } = useFormContext<FormForm>();

  const handleUpdate = async () => {
    try {
      const fieldValue = getValues(`fields.${index}`);
      const { name, description, type, fieldSelect, fieldNumber } = fieldValue;

      let param: putSchemaType;
      if (type === FieldType.SELECT) {
        param = {
          type: FieldType.SELECT,
          name,
          description,
          options:
            fieldSelect?.fieldSelectOptions.map((option) => ({
              id: option.id,
              label: option.label,
              price: option.price,
            })) || [],
          deleteOptionIds: fieldSelect?.deleteOptionIds || [],
        };
      } else {
        // MEMO: ltはこのタイミングで動的に生成する
        param = {
          type: FieldType.NUMBER,
          name,
          description,
          options:
            fieldNumber?.fieldNumberRanges.map((range, i) => ({
              id: range.id,
              price: range.price,
              gte: i === 0 ? undefined : fieldNumber?.fieldNumberRanges[i - 1].lt || undefined,
              lt:
                i !== fieldNumber?.fieldNumberRanges.length - 1
                  ? fieldNumber?.fieldNumberRanges[i].lt || undefined
                  : undefined,
            })) || [],
          deleteOptionIds: fieldNumber?.deleteOptionIds || [],
        };
      }

      const res = await fetch(`/api/admin/form/${getValues('id')}/field/${getValues(`fields.${index}.id`)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      });

      if (!res.ok) throw new Error('error');

      // MEMO: 各オプションにidを付与し、増分判定から除外できるようにする
      const data = await res.json();
      if (type === FieldType.SELECT) {
        const newFieldSelectOptionValue = fieldSelect?.fieldSelectOptions.map((option, i) => ({
          ...option,
          id: data.fieldSelect.fieldSelectOptions[i].id,
        }));

        setValue(`fields.${index}.fieldSelect.fieldSelectOptions`, newFieldSelectOptionValue || []);
      }

      if (type === FieldType.NUMBER) {
        const newFieldSelectOptionValue = fieldNumber?.fieldNumberRanges.map((range, i) => ({
          ...range,
          id: data.fieldNumber.fieldNumberRanges[i].id,
        }));

        setValue(`fields.${index}.fieldNumber.fieldNumberRanges`, newFieldSelectOptionValue || []);
      }

      openToast('success', 'フィールドを更新しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
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
        {/* TODO: 順序並び替え機能を実装したら繋ぎ込む */}
        {/* <IconButton
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
        /> */}
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
