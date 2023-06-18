'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { Table } from '@/components/ui/Table';
import { getPublishUrl } from '@/utils/url';

import type { Cell } from '@/components/ui/Table';
import type { Form } from '@prisma/client';
import type { FC } from 'react';

type Props = {
  formsData: Form[];
};

export const DashBoard: FC<Props> = ({ formsData }) => {
  const [forms, setForms] = useState<Form[]>(formsData);
  const tableRows = useMemo<Cell[][]>(
    () =>
      forms.map((form) => [
        { type: 'text', value: form.name },
        { type: 'text', value: form.description },
        { type: 'link', value: getPublishUrl(form) },
      ]),
    [forms],
  );
  const formIds = useMemo(() => forms.map((form) => form.id), [forms]);

  const handleAddForm = async () => {
    try {
      const res = await fetch('/api/admin/form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('error');

      const json = await res.json();
      setForms([...forms, json]);

      window.alert('フォームを作成しました');
    } catch (err) {
      console.error(err);
      window.alert('エラーが発生しました');
    }
  };

  const handleDeleteForm = async (formId: number) => {
    try {
      const res = await fetch(`/api/admin/form/${formId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('error');

      setForms((prev) => prev.filter((form) => form.id !== formId));

      window.alert('フォームを削除しました');
    } catch (err) {
      console.error(err);
      window.alert('エラーが発生しました');
    }
  };

  return (
    <div className='flex flex-col items-start w-full max-w-5xl gap-4'>
      <Heading label='ダッシュボード' />

      <Table
        headers={['フォーム名', '概要', '共有URL']}
        data={tableRows}
        formIds={formIds}
        onDelete={handleDeleteForm}
      />

      <Button
        type='submit'
        theme='primary'
        svgComponent={(className) => <PlusIcon className={className} />}
        onClick={handleAddForm}
      >
        新規作成
      </Button>
    </div>
  );
};
