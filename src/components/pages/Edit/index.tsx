'use client';

import { ArrowLeftIcon, PlusIcon } from '@heroicons/react/24/solid';
import { FieldType } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { Field } from '@/components/pages/Edit/fields';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Input } from '@/components/ui/Input';

import type { FormForm } from '@/components/pages/Edit/type';
import type { FC } from 'react';
import type { SubmitHandler } from 'react-hook-form';

type Props = {
  formData: FormForm;
};

export const Edit: FC<Props> = ({ formData }) => {
  const router = useRouter();
  const formFormMethods = useForm<FormForm>({ defaultValues: formData, mode: 'onChange' });
  const fields = useFieldArray({ control: formFormMethods.control, name: 'fields' });
  const watchFormId = formFormMethods.watch('id');

  const handleAddField = async (type: FieldType) => {
    try {
      const res = await fetch(`/api/admin/form/${watchFormId}/field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: formData.id,
          type,
        }),
      });

      if (!res.ok) throw new Error('error');

      const data = await res.json();
      fields.append(data);
      window.alert('フィールドを作成しました');
    } catch (err) {
      console.error(err);
      window.alert('エラーが発生しました');
    }
  };

  const handleDeleteField = async (index: number) => {
    try {
      await fetch(`/api/admin/form/${watchFormId}/field/${formFormMethods.getValues(`fields.${index}.id`)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      fields.remove(index);
      window.alert('削除しました');
    } catch (err) {
      window.alert('エラーが発生しました');
    }
  };

  const onSubmit: SubmitHandler<FormForm> = async (data) => {
    try {
      const res = await fetch(`/api/admin/form/${data.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      if (!res.ok) throw new Error('error');

      window.alert('フォームを更新しました');
    } catch (err) {
      console.error(err);
      window.alert('エラーが発生しました');
    }
  };

  return (
    <FormProvider {...formFormMethods}>
      <div className='flex flex-col items-start w-full max-w-5xl gap-4'>
        <form
          className='flex flex-col items-start w-full max-w-5xl gap-4'
          onSubmit={formFormMethods.handleSubmit(onSubmit)}
        >
          <Button
            theme='primary'
            type='button'
            svgComponent={(className) => <ArrowLeftIcon className={className} />}
            onClick={() => router.back()}
          >
            戻る
          </Button>

          <Heading label='フォーム編集' />

          <Input
            {...formFormMethods.register('name')}
            label='フォーム名'
            type='text'
            placeholder='フォーム名を入力'
            fullWidth
          />

          <Input
            {...formFormMethods.register('description')}
            label='説明'
            type='text'
            placeholder='説明を入力'
            fullWidth
          />

          <Button className='self-end' theme='primary' type='submit'>
            基本情報を更新
          </Button>
        </form>

        {fields.fields.map((field, index) => (
          <Field key={field.id} type={field.type} index={index} onDelete={handleDeleteField} />
        ))}

        <div className='flex items-center gap-2'>
          <Button
            theme='primary'
            type='button'
            svgComponent={(className) => <PlusIcon className={className} />}
            onClick={() => handleAddField(FieldType.SELECT)}
          >
            選択入力
          </Button>

          <Button
            theme='primary'
            type='button'
            svgComponent={(className) => <PlusIcon className={className} />}
            onClick={() => handleAddField(FieldType.NUMBER)}
          >
            数値入力
          </Button>
        </div>

        <p className='text-black text-normal'>20個まで追加できます。</p>
      </div>
    </FormProvider>
  );
};
