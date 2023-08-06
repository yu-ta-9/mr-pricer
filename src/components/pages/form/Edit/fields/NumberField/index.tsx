import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { FieldType } from '@prisma/client';
import { Fragment, useMemo, type FC } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { FIELD_NUMBER_RANGE_LIMIT } from '@/utils/validation/field';

import type { putSchemaType } from '@/app/api/admin/form/[formId]/field/[fieldId]/schema';
import type { FormForm } from '@/components/pages/form/Edit/type';

type Props = {
  /** ネスト考慮 */
  name: `fields.${number}`;
};

const getRangeLabel = (index: number, length: number) => {
  if (index + 1 === 1) {
    return `(1) 入力が0 〜 (1)未満の時`;
  }

  if (index + 1 === length) {
    return `(${index + 1}) 入力が(${index})以上の時`;
  }

  return `(${index + 1}) 入力が(${index})以上 (${index + 1})未満の時`;
};

export const NumberField: FC<Props> = ({ name }) => {
  const { register, control, setValue, getValues } = useFormContext<FormForm>();
  const { openToast } = useToast();
  const fieldNumberRanges = useFieldArray({
    control,
    name: `${name}.fieldNumber.fieldNumberRanges`,
    keyName: 'hookFormArrayKey',
  });

  const isEnableDeleteOption = useMemo(() => fieldNumberRanges.fields.length > 2, [fieldNumberRanges.fields.length]);

  const handleDeleteOption = (
    i: number,
    fieldNumberRange: NonNullable<FormForm['fields'][number]['fieldNumber']>['fieldNumberRanges'][number],
  ) => {
    fieldNumberRanges.remove(i);
    // MEMO: 削除マーカーを付与
    if (fieldNumberRange.id !== 0) {
      setValue(`${name}.fieldNumber.deleteOptionIds`, [
        ...(getValues(`${name}.fieldNumber.deleteOptionIds`) || []),
        fieldNumberRange.id,
      ]);
    }
  };

  const handleUpdate = async () => {
    try {
      const fieldValue = getValues(name);
      const { name: fieldName, description, fieldNumber } = fieldValue;

      // MEMO: ltはこのタイミングで動的に生成する
      const param: putSchemaType = {
        type: FieldType.NUMBER,
        name: fieldName,
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

      const res = await fetch(`/api/admin/form/${getValues('id')}/field/${getValues(`${name}.id`)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      });

      if (!res.ok) throw new Error('error');

      // MEMO: 各オプションにidを付与し、増分判定から除外できるようにする
      const data = await res.json();

      const newFieldSelectOptionValue = fieldNumber?.fieldNumberRanges.map((range, i) => ({
        ...range,
        id: data.fieldNumber.fieldNumberRanges[i].id,
      }));

      setValue(`${name}.fieldNumber.fieldNumberRanges`, newFieldSelectOptionValue || []);

      openToast('success', 'フィールドを更新しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  return (
    <>
      <Input {...register(`${name}.name`)} label='設問名' type='text' placeholder='設問名を入力' />

      {fieldNumberRanges.fields.map((fieldNumberRange, i) => (
        <Fragment key={fieldNumberRange.hookFormArrayKey}>
          <p>{getRangeLabel(i, fieldNumberRanges.fields.length)}</p>

          <div className='flex items-center gap-2'>
            {fieldNumberRanges.fields.length > 1 && i === fieldNumberRanges.fields.length - 1 ? (
              <div className='w-full' />
            ) : (
              <Input
                {...register(`${name}.fieldNumber.fieldNumberRanges.${i}.lt`, { valueAsNumber: true })}
                label='値'
                type='number'
                placeholder='値を入力'
                fullWidth
              />
            )}

            <Input
              {...register(`${name}.fieldNumber.fieldNumberRanges.${i}.price`, { valueAsNumber: true })}
              label='金額'
              type='number'
              placeholder='金額'
            />

            {/* TODO: やや強引な下揃え配置になっている */}
            {isEnableDeleteOption && (
              <IconButton
                theme='danger'
                className='self-end mb-1'
                svgComponent={(className) => <TrashIcon className={className} />}
                onClick={() => handleDeleteOption(i, fieldNumberRange)}
              />
            )}
          </div>
        </Fragment>
      ))}

      <Button
        className='self-end'
        theme='primary'
        type='button'
        svgComponent={(className) => <PlusIcon className={className} />}
        onClick={() => {
          fieldNumberRanges.append({
            id: 0,
            fieldNumberId: getValues(`${name}.fieldNumber.id`),
            gte: 0,
            lt: 0,
            price: 0,
          });
        }}
        disabled={fieldNumberRanges.fields.length >= FIELD_NUMBER_RANGE_LIMIT}
      >
        追加
      </Button>

      <p className='self-end text-black text-normal'>{FIELD_NUMBER_RANGE_LIMIT}個まで追加できます。</p>

      <Button theme='primary' type='button' onClick={handleUpdate}>
        更新
      </Button>
    </>
  );
};
