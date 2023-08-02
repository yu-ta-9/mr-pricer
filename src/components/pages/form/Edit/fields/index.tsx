import { TrashIcon } from '@heroicons/react/24/solid';
import { FieldType } from '@prisma/client';
import { memo, useMemo, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ConditionField } from '@/components/pages/form/Edit/fields/ConditionField';
import { NumberField } from '@/components/pages/form/Edit/fields/NumberField';
import { SelectField } from '@/components/pages/form/Edit/fields/SelectField';
import { IconButton } from '@/components/ui/IconButton';
import { SelectMulti } from '@/components/ui/SelectMulti';

import type { ReactSelectOption } from '../../../../../../types/react-select';
import type { FormForm, ParsedField } from '@/components/pages/form/Edit/type';
import type { FC } from 'react';

type ConditionParams = {
  field: ParsedField;
  conditionFieldIndexes: number[];
};

type Props = {
  field: ParsedField;
  index: number;
  onDelete: (index: number) => void;
  conditionParams?: ConditionParams;
};

const getField = (type: FieldType, index: number, field: ParsedField, conditionFieldIndexes: number[]) => {
  switch (type) {
    case FieldType.SELECT:
      return <SelectField name={getFieldNamePrefix(index, conditionFieldIndexes)} />;
    case FieldType.NUMBER:
      return <NumberField name={getFieldNamePrefix(index, conditionFieldIndexes)} />;
    case FieldType.CONDITION:
      return (
        <ConditionField
          index={index}
          name={getFieldNamePrefix(index, conditionFieldIndexes)}
          field={field}
          conditionFieldIndexes={conditionFieldIndexes}
        />
      );
  }
};

const getFieldLabel = (type: FieldType) => {
  switch (type) {
    case FieldType.SELECT:
      return '選択入力';
    case FieldType.NUMBER:
      return '数値入力';
    case FieldType.CONDITION:
      return '条件分岐';
  }
};

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

const _Field: FC<Props> = ({ field, index, onDelete, conditionParams }) => {
  const { formId, type } = field;
  const isInBranch = conditionParams !== undefined;

  const { control } = useFormContext<FormForm>();
  const indexLabel = useMemo(
    () =>
      isInBranch
        ? `${(conditionParams.conditionFieldIndexes[conditionParams.conditionFieldIndexes.length - 1] || 0) + 1} - ${
            index + 1
          }`
        : index + 1,
    [isInBranch, conditionParams?.conditionFieldIndexes, index],
  );

  const [conditionOptions, setConditionOptions] = useState<ReactSelectOption[]>(
    conditionParams?.field.fieldCondition?.fieldConditionBranches.map((fieldConditionBranch) => ({
      label: fieldConditionBranch.label,
      value: fieldConditionBranch.id,
    })) || [],
  );

  return (
    <div className='relative flex flex-col w-full gap-4 p-4 border-2 rounded border-primary'>
      {isInBranch && (
        <>
          <Controller
            control={control}
            name={`${getFieldNamePrefix(index, conditionParams.conditionFieldIndexes)}.fieldConditionBranches`}
            // MEMO: 現状のvalueの型だとonChangeが上手くハマらないので分割代入で回避している
            render={({ field: { ref, name, onBlur, value, onChange }, fieldState }) => (
              <SelectMulti
                ref={ref}
                name={name}
                onBlur={onBlur}
                options={conditionOptions}
                backspaceRemovesValue={false}
                isClearable={false}
                value={
                  conditionOptions.filter((option) =>
                    value.map((v) => v.fieldConditionBranchId).includes(option.value as number),
                  ) || []
                }
                onOptionChange={(newValue) => {
                  onChange(newValue.map((option) => ({ fieldConditionBranchId: option.value as number })));
                }}
                onFocus={async () => {
                  try {
                    const data = await fetch(
                      `/api/admin/form/${formId}/field/${conditionParams.field.id}/field_condition/field_condition_branch`,
                    );
                    const json = await data.json();

                    setConditionOptions(
                      json?.map((data: any) => ({
                        label: data.label,
                        value: data.id,
                      })),
                    );
                  } catch {
                    console.error('options fetch failed');
                  }
                }}
                label='表示条件'
                placeholder='表示条件を選択してください'
                error={fieldState.error?.message ? fieldState.error.message : undefined}
              />
            )}
          />
        </>
      )}

      {getField(type, index, field, conditionParams?.conditionFieldIndexes || [])}

      {/** MEMO: 以下absoluteな要素群 */}

      <div className='absolute top-0 left-0 flex items-center gap-2 -translate-x-[16px] -translate-y-1/2'>
        <div
          className={`flex items-center justify-center text-white rounded-full bg-primary h-8 ${
            isInBranch ? 'break-keep w-fit px-2' : 'w-8'
          }`}
        >
          {indexLabel}
        </div>

        <p className='pl-2 pr-2 font-semibold bg-white'>{getFieldLabel(type)}</p>
      </div>

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
