import { memo, type FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Select } from '@/components/ui/Select';
import { SelectMulti } from '@/components/ui/SelectMulti';

import type { postSchemaType } from '@/app/api/p/result/schema';

type Props = {
  index: number;
  id: number;
  label: string;
  options: { label: string; value: string }[];
  isMulti: boolean;
};

const _SelectField: FC<Props> = ({ index, id, label, options, isMulti }) => {
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<postSchemaType>();

  useEffect(() => {
    setValue(`fields.${index}.id`, id);
  }, [index, id, setValue]);

  if (isMulti) {
    return (
      <Controller
        control={control}
        name={`fields.${index}.value`}
        render={({ field, fieldState }) => (
          <SelectMulti
            {...field}
            value={options.filter((option) =>
              Array.isArray(field.value) ? field.value.includes(Number(option.value)) : false,
            )}
            onOptionChange={(newValue) => {
              field.onChange(newValue.map((option) => Number(option.value)));
            }}
            label={label}
            options={options}
            placeholder='選択'
            error={fieldState.error?.message ? fieldState.error.message : undefined}
          />
        )}
      />
    );
  }

  return (
    <Select
      {...register(`fields.${index}.value`, { valueAsNumber: true })}
      label={label}
      options={options}
      placeholder='選択'
      error={errors.fields !== undefined ? errors.fields[index]?.value?.message : ''}
    />
  );
};

export const SelectField = memo(_SelectField);
