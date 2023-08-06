import { memo, useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';

import { usePublishPageContext } from '@/components/pages/Publish/usePublishPageContext';
import { getRecursiveError } from '@/components/pages/Publish/utils/hookForm';
import { Input } from '@/components/ui/Input';

import type { postSchemaType } from '@/app/api/p/result/schema';
import type { FC } from 'react';

type Props = {
  id: number;
  label: string;
  name: `fields.${number}`;
};

const _NumberField: FC<Props> = ({ id, label, name }) => {
  const { formData } = usePublishPageContext();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<postSchemaType>();

  useEffect(() => {
    setValue(`${name}.id`, id);
  }, [name, id, setValue]);

  const error = useMemo(() => getRecursiveError(name, errors), [name, errors]);

  return (
    <Input
      {...register(`${name}.value`, { valueAsNumber: true })}
      label={label}
      type='number'
      placeholder='数値を入力'
      error={error !== undefined ? error.value?.message : ''}
      customColor={formData?.profile?.profileTheme || undefined}
    />
  );
};

export const NumberField = memo(_NumberField);
