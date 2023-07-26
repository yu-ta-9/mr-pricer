import { memo } from 'react';

import { NumberField } from '@/components/pages/Publish/Form/fields/NumberField';
import { SelectField } from '@/components/pages/Publish/Form/fields/SelectField';

import type { FormData } from '@/components/pages/Publish/type';
import type { FC } from 'react';

type Props = { field: FormData['fields'][number]; index: number };

const _Field: FC<Props> = ({ field, index }) => {
  switch (field.type) {
    case 'SELECT':
      return (
        <SelectField
          index={index}
          id={field.id}
          label={field.name}
          options={
            field.fieldSelect?.fieldSelectOptions.map((option) => ({
              label: option.label,
              value: String(option.id),
            })) || []
          }
          isMulti={field.fieldSelect?.isMulti || false}
        />
      );
    case 'NUMBER':
      return <NumberField index={index} id={field.id} label={field.name} />;
  }
};

export const Field = memo(_Field);
