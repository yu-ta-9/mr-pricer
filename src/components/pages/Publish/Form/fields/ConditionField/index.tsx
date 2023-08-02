import { memo, type FC, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Field } from '@/components/pages/Publish/Form/fields';
import { RadioGroup } from '@/components/ui/RadioGroup';

import type { postSchemaType } from '@/app/api/p/result/schema';
import type { FormData } from '@/components/pages/Publish/type';

type Props = {
  index: number;
  field: FormData['fields'][number];
  name: `fields.${number}`;
  conditionFieldIndexes: number[];
};

const _ConditionField: FC<Props> = ({ index, field, name, conditionFieldIndexes }) => {
  const { control, setValue, watch } = useFormContext<postSchemaType>();

  const watchValue = watch(`${name}.value`);

  useEffect(() => {
    setValue(`${name}.id`, field.id);
  }, [name, field.id, setValue]);

  return (
    <>
      <Controller
        control={control}
        name={`${name}.value`}
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <RadioGroup
            label={field.name}
            value={value as number}
            options={
              field.fieldCondition?.fieldConditionBranches.map((fieldConditionBranch) => ({
                label: fieldConditionBranch.label,
                value: fieldConditionBranch.id,
              })) || []
            }
            name={`${field.id}-${field.name}`}
            onChange={(value: string) => {
              onChange(Number(value));
            }}
            error={error?.message}
          />
        )}
      />

      {field.fields
        .filter((field) =>
          field.fieldConditionBranches.map((branch) => branch.fieldConditionBranchId).includes(watchValue as number),
        )
        .map((field, i) => (
          <Field key={field.id} field={field} index={i} conditionFieldIndexes={[...conditionFieldIndexes, index]} />
        ))}
    </>
  );
};

export const ConditionField = memo(_ConditionField);
