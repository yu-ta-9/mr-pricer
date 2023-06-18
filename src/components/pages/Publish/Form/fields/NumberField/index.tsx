import { memo } from 'react';

import { Input } from '@/components/ui/Input';

import type { FC } from 'react';

type Props = {
  label: string;
};

const _NumberField: FC<Props> = ({ label }) => {
  return <Input label={label} type='number' placeholder='数値を入力' />;
};

export const NumberField = memo(_NumberField);
