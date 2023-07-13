import { memo, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@/components/ui/Input';

import type { postSchemaType } from '@/app/api/p/result/schema';
import type { FC } from 'react';

type Props = {
  index: number;
  id: number;
  label: string;
};

const _NumberField: FC<Props> = ({ index, id, label }) => {
  const { register, setValue } = useFormContext<postSchemaType>();

  useEffect(() => {
    setValue(`fields.${index}.id`, id);
  }, [index, id, setValue]);

  return (
    <Input
      {...register(`fields.${index}.value`, { valueAsNumber: true })}
      label={label}
      type='number'
      placeholder='数値を入力'
    />
  );
};

export const NumberField = memo(_NumberField);
