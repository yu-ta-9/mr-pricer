import { memo, type FC, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

import { Select } from '@/components/ui/Select';

import type { postSchemaType } from '@/app/api/p/result/schema';

type Props = {
  index: number;
  id: number;
  label: string;
  options: { label: string; value: string }[];
};

const _SelectField: FC<Props> = ({ index, id, label, options }) => {
  const { register, setValue } = useFormContext<postSchemaType>();

  useEffect(() => {
    setValue(`fields.${index}.id`, id);
  }, [index, id, setValue]);

  return <Select {...register(`fields.${index}.value`, { valueAsNumber: true })} label={label} options={options} />;
};

export const SelectField = memo(_SelectField);
