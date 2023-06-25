import { TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';

import type { FormForm } from '@/components/pages/form/Edit/type';
import type { FC } from 'react';

type Props = {
  index: number;
};

export const SelectField: FC<Props> = ({ index }) => {
  const { register, control } = useFormContext<FormForm>();
  const fieldSelectOptions = useFieldArray({
    control,
    name: `fields.${index}.fieldSelect.fieldSelectOptions`,
    keyName: 'hookFormArrayKey',
  });

  return (
    <>
      <Input {...register(`fields.${index}.name`)} label='設問名' type='text' placeholder='設問名を入力' />

      {fieldSelectOptions.fields.map((fieldSelectOption, i) => (
        <div key={fieldSelectOption.hookFormArrayKey} className='flex items-center gap-2'>
          <Input
            {...register(`fields.${index}.fieldSelect.fieldSelectOptions.${i}.label`)}
            label={`選択肢${i + 1}`}
            type='text'
            placeholder='入力してください'
            fullWidth
          />
          <Input
            {...register(`fields.${index}.fieldSelect.fieldSelectOptions.${i}.price`, { valueAsNumber: true })}
            label='金額（税抜）'
            type='number'
            placeholder='金額'
          />

          {/* TODO: やや強引な下揃え配置になっている */}
          <IconButton
            theme='danger'
            className='self-end mb-1'
            svgComponent={(className) => <TrashIcon className={className} />}
            onClick={() => {
              console.log('delete');
            }}
          />
        </div>
      ))}

      <Button
        className='self-end'
        theme='primary'
        type='button'
        svgComponent={(className) => <PlusIcon className={className} />}
        onClick={() => fieldSelectOptions.append({ label: '', price: 0 })}
      >
        追加
      </Button>

      <p className='self-end text-black text-normal'>10個まで追加できます。</p>
    </>
  );
};
