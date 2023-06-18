import { memo, type FC } from 'react';

import { Select } from '@/components/ui/Select';

type Props = {
  label: string;
  options: { label: string; value: string }[];
};

const _SelectField: FC<Props> = ({ label, options }) => {
  return <Select label={label} options={options} />;
};

export const SelectField = memo(_SelectField);
