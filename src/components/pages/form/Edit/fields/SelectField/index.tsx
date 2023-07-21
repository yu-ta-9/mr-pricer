import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { FIELD_SELECT_OPTION_LIMIT } from '@/utils/validation/field';

import type { FormForm } from '@/components/pages/form/Edit/type';
import type { FC } from 'react';

type Props = {
  index: number;
};

export const SelectField: FC<Props> = ({ index }) => {
  const { register, control, setValue, getValues } = useFormContext<FormForm>();
  const fieldSelectOptions = useFieldArray({
    control,
    name: `fields.${index}.fieldSelect.fieldSelectOptions`,
    keyName: 'hookFormArrayKey',
  });

  const isEnableDeleteOption = useMemo(() => fieldSelectOptions.fields.length > 1, [fieldSelectOptions.fields.length]);

  const handleDeleteOption = (
    i: number,
    fieldSelectOption: NonNullable<FormForm['fields'][number]['fieldSelect']>['fieldSelectOptions'][number],
  ) => {
    fieldSelectOptions.remove(i);
    // MEMO: 削除マーカーを付与
    if (fieldSelectOption.id !== undefined) {
      setValue(`fields.${index}.fieldSelect.deleteOptionIds`, [
        ...(getValues(`fields.${index}.fieldSelect.deleteOptionIds`) || []),
        fieldSelectOption.id,
      ]);
    }
  };

  return (
    <>
      <Input {...register(`fields.${index}.name`)} label='設問名' type='text' placeholder='設問名を入力' />

      {fieldSelectOptions.fields.map((fieldSelectOption, i) => (
        <div key={fieldSelectOption.hookFormArrayKey} className='flex items-center gap-2'>
          <Input
            {...register(`fields.${index}.fieldSelect.fieldSelectOptions.${i}.label`)}
            label={`選択肢${i + 1}`}
            type='text'
            placeholder='入力してください'
            fullWidth
          />
          <Input
            {...register(`fields.${index}.fieldSelect.fieldSelectOptions.${i}.price`, { valueAsNumber: true })}
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
              onClick={() => handleDeleteOption(i, fieldSelectOption)}
            />
          )}
        </div>
      ))}

      <Button
        className='self-end'
        theme='primary'
        type='button'
        svgComponent={(className) => <PlusIcon className={className} />}
        onClick={() => fieldSelectOptions.append({ label: '', price: 0 })}
        disabled={fieldSelectOptions.fields.length >= FIELD_SELECT_OPTION_LIMIT}
      >
        追加
      </Button>

      <p className='self-end text-black text-normal'>{FIELD_SELECT_OPTION_LIMIT}個まで追加できます。</p>
    </>
  );
};
