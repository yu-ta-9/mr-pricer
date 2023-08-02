import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { FieldType } from '@prisma/client';
import { useMemo } from 'react';
import { Controller, useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { ToggleButton } from '@/components/ui/ToggleButton';
import { useToast } from '@/hooks/useToast';
import { FIELD_SELECT_OPTION_LIMIT } from '@/utils/validation/field';

import type { putSchemaType } from '@/app/api/admin/form/[formId]/field/[fieldId]/schema';
import type { FormForm } from '@/components/pages/form/Edit/type';
import type { FC } from 'react';

type Props = {
  /** ネスト考慮 */
  name: `fields.${number}`;
};

export const SelectField: FC<Props> = ({ name }) => {
  const { register, control, setValue, getValues } = useFormContext<FormForm>();
  const { openToast } = useToast();
  const fieldSelectOptions = useFieldArray({
    control,
    name: `${name}.fieldSelect.fieldSelectOptions`,
    keyName: 'hookFormArrayKey',
  });

  const isEnableDeleteOption = useMemo(() => fieldSelectOptions.fields.length > 1, [fieldSelectOptions.fields.length]);

  const handleDeleteOption = (
    i: number,
    fieldSelectOption: NonNullable<FormForm['fields'][number]['fieldSelect']>['fieldSelectOptions'][number],
  ) => {
    fieldSelectOptions.remove(i);
    // MEMO: 削除マーカーを付与
    if (fieldSelectOption.id !== 0) {
      setValue(`${name}.fieldSelect.deleteOptionIds`, [
        ...(getValues(`${name}.fieldSelect.deleteOptionIds`) || []),
        fieldSelectOption.id,
      ]);
    }
  };

  const handleUpdate = async () => {
    try {
      const fieldValue = getValues(name);
      const { name: fieldName, description, fieldSelect, fieldConditionBranches } = fieldValue;

      const param: putSchemaType = {
        type: FieldType.SELECT,
        name: fieldName,
        description,
        fieldConditionBranchIds: fieldConditionBranches.map(
          (fieldConditionBranch) => fieldConditionBranch.fieldConditionBranchId,
        ),
        isMulti: fieldSelect?.isMulti || false,
        options:
          fieldSelect?.fieldSelectOptions.map((option) => ({
            id: option.id,
            label: option.label,
            price: option.price,
          })) || [],
        deleteOptionIds: fieldSelect?.deleteOptionIds || [],
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
      const newFieldSelectOptionValue = fieldSelect?.fieldSelectOptions.map((option, i) => ({
        ...option,
        id: data.fieldSelect.fieldSelectOptions[i].id,
      }));

      setValue(`${name}.fieldSelect.fieldSelectOptions`, newFieldSelectOptionValue || []);

      openToast('success', 'フィールドを更新しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  return (
    <>
      <Input {...register(`${name}.name`)} label='設問名' type='text' placeholder='設問名を入力' />

      <Controller
        control={control}
        name={`${name}.fieldSelect.isMulti`}
        render={({ field: { value, onChange } }) => (
          <ToggleButton
            label='複数選択可'
            isOn={value}
            onToggle={() => {
              onChange(!value);
            }}
          />
        )}
      />

      {fieldSelectOptions.fields.map((fieldSelectOption, i) => (
        <div key={fieldSelectOption.hookFormArrayKey} className='flex items-center gap-2'>
          <Input
            {...register(`${name}.fieldSelect.fieldSelectOptions.${i}.label`)}
            label={`選択肢${i + 1}`}
            type='text'
            placeholder='入力してください'
            fullWidth
          />
          <Input
            {...register(`${name}.fieldSelect.fieldSelectOptions.${i}.price`, { valueAsNumber: true })}
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
        // MEMO: idが未採番なので0を入れる
        onClick={() =>
          fieldSelectOptions.append({ label: '', price: 0, id: 0, fieldSelectId: getValues(`${name}.fieldSelect.id`) })
        }
        disabled={fieldSelectOptions.fields.length >= FIELD_SELECT_OPTION_LIMIT}
      >
        追加
      </Button>

      <p className='self-end text-black text-normal'>{FIELD_SELECT_OPTION_LIMIT}個まで追加できます。</p>

      <Button theme='primary' type='button' onClick={handleUpdate}>
        更新
      </Button>
    </>
  );
};
