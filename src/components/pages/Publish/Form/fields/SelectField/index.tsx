import { memo, type FC, useEffect, useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { usePublishPageContext } from '@/components/pages/Publish/usePublishPageContext';
import { getRecursiveError } from '@/components/pages/Publish/utils/hookForm';
import { Select } from '@/components/ui/Select';
import { SelectMulti } from '@/components/ui/SelectMulti';

import type { postSchemaType } from '@/app/api/p/result/schema';

type Props = {
  id: number;
  name: `fields.${number}`;
  label: string;
  options: { label: string; value: string }[];
  isMulti: boolean;
};

const _SelectField: FC<Props> = ({ id, name, label, options, isMulti }) => {
  const { formData } = usePublishPageContext();
  const {
    register,
    control,
    setValue,
    formState: { errors },
  } = useFormContext<postSchemaType>();

  useEffect(() => {
    setValue(`${name}.id`, id);
  }, [name, id, setValue]);

  const error = useMemo(() => getRecursiveError(name, errors), [name, errors]);

  if (isMulti) {
    return (
      <Controller
        control={control}
        name={`${name}.value`}
        // MEMO: 現状のvalueの型だとonChangeが上手くハマらないので分割代入で回避している
        render={({ field: { ref, name, onBlur, value, onChange }, fieldState }) => (
          <SelectMulti
            ref={ref}
            name={name}
            onBlur={onBlur}
            value={options.filter((option) => (Array.isArray(value) ? value.includes(Number(option.value)) : false))}
            onOptionChange={(newValue) => {
              onChange(newValue.map((option) => Number(option.value)));
            }}
            label={label}
            options={options}
            placeholder='選択'
            error={fieldState.error?.message ? fieldState.error.message : undefined}
            customColor={formData?.profile?.profileTheme || undefined}
          />
        )}
      />
    );
  }

  return (
    <Select
      {...register(`${name}.value`, { valueAsNumber: true })}
      label={label}
      options={options}
      placeholder='選択'
      error={error !== undefined ? error.value?.message : ''}
      customColor={formData?.profile?.profileTheme || undefined}
    />
  );
};

export const SelectField = memo(_SelectField);
