import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { Fragment, useMemo, type FC } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { FIELD_NUMBER_RANGE_LIMIT } from '@/utils/validation/field';

import type { FormForm } from '@/components/pages/form/Edit/type';

type Props = {
  index: number;
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

export const NumberField: FC<Props> = ({ index }) => {
  const { register, control, setValue, getValues } = useFormContext<FormForm>();
  const fieldNumberRanges = useFieldArray({
    control,
    name: `fields.${index}.fieldNumber.fieldNumberRanges`,
    keyName: 'hookFormArrayKey',
  });

  const isEnableDeleteOption = useMemo(() => fieldNumberRanges.fields.length > 2, [fieldNumberRanges.fields.length]);

  const handleDeleteOption = (
    i: number,
    fieldNumberRange: NonNullable<FormForm['fields'][number]['fieldNumber']>['fieldNumberRanges'][number],
  ) => {
    fieldNumberRanges.remove(i);
    // MEMO: 削除マーカーを付与
    if (fieldNumberRange.id !== undefined) {
      setValue(`fields.${index}.fieldNumber.deleteOptionIds`, [
        ...(getValues(`fields.${index}.fieldNumber.deleteOptionIds`) || []),
        fieldNumberRange.id,
      ]);
    }
  };

  return (
    <>
      <Input {...register(`fields.${index}.name`)} label='設問名' type='text' placeholder='設問名を入力' />

      {fieldNumberRanges.fields.map((fieldNumberRange, i) => (
        <Fragment key={fieldNumberRange.hookFormArrayKey}>
          <p>{getRangeLabel(i, fieldNumberRanges.fields.length)}</p>

          <div className='flex items-center gap-2'>
            {fieldNumberRanges.fields.length > 1 && i === fieldNumberRanges.fields.length - 1 ? (
              <div className='w-full' />
            ) : (
              <Input
                {...register(`fields.${index}.fieldNumber.fieldNumberRanges.${i}.lt`, { valueAsNumber: true })}
                label='値'
                type='number'
                placeholder='値を入力'
                fullWidth
              />
            )}

            <Input
              {...register(`fields.${index}.fieldNumber.fieldNumberRanges.${i}.price`, { valueAsNumber: true })}
              label='金額（税抜）'
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
            gte: 0,
            lt: 0,
            price: 0,
          });
        }}
        disabled={fieldNumberRanges.fields.length >= 5}
      >
        追加
      </Button>

      <p className='self-end text-black text-normal'>{FIELD_NUMBER_RANGE_LIMIT}個まで追加できます。</p>
    </>
  );
};
