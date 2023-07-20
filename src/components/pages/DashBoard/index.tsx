'use client';

import { DocumentDuplicateIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { IconButton } from '@/components/ui/IconButton';
import { Table } from '@/components/ui/Table';
import { TextLink } from '@/components/ui/TextLink';
import { useToast } from '@/hooks/useToast';
import { getPublishUrl } from '@/utils/url';
import { FORM_COUNT_LIMIT } from '@/utils/validation/form';
import { PROFILE_COUNT_LIMIT } from '@/utils/validation/profile';

import type { Form, Profile } from '@prisma/client';
import type { FC } from 'react';

type Props = {
  formsData: Form[];
  profilesData: Profile[];
};

export const DashBoard: FC<Props> = ({ formsData, profilesData }) => {
  const { openToast } = useToast();
  const [forms, setForms] = useState<Form[]>(formsData);
  const [profiles, setProfiles] = useState<Profile[]>(profilesData);
  const tableFormRows = useMemo<any[][]>(
    () =>
      forms.map((form) => [
        form.name,
        form.description,
        <div key={form.id} className='flex items-center gap-4'>
          <TextLink type='external' href={getPublishUrl(form)} label={getPublishUrl(form)} />
          <IconButton
            theme='primary'
            svgComponent={(_className: string) => (
              <DocumentDuplicateIcon className='w-4 h-4 stroke-2 fill-primary hover:opacity-50' />
            )}
            onClick={() => {
              navigator.clipboard.writeText(getPublishUrl(form));
              openToast('info', 'コピーしました');
            }}
          />
        </div>,

        <TextLink key={form.id} type='internal' href={`form/${form.id}/edit/`} label='編集' />,

        <Button key={form.id} theme='danger' type='button' onClick={() => handleDeleteForm(form.id)}>
          削除
        </Button>,
      ]),
    [forms],
  );

  const profileTableRows = useMemo<any[]>(
    () =>
      profiles.map((profile) => [
        profile.name,
        <TextLink key={profile.id} type='internal' href={`profile/${profile.id}/edit/`} label='編集' />,
        <Button key={profile.id} theme='danger' type='button' onClick={() => handleDeleteProfile(profile.id)}>
          削除
        </Button>,
      ]),
    [profiles],
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
      setForms((prev) => [...prev, json]);

      openToast('success', 'フォームを作成しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  const handleDeleteForm = async (formId: number) => {
    if (!window.confirm('フォームを削除しますか？')) return;

    try {
      const res = await fetch(`/api/admin/form/${formId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('error');

      setForms((prev) => prev.filter((form) => form.id !== formId));

      openToast('success', 'フォームを削除しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  const handleAddProfile = async () => {
    try {
      const res = await fetch('/api/admin/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('error');

      const json = await res.json();
      setProfiles((prev) => [...prev, json]);

      openToast('success', 'プロフィールを作成しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  const handleDeleteProfile = async (profileId: number) => {
    if (!window.confirm('プロフィールを削除しますか？')) return;

    try {
      const res = await fetch(`/api/admin/profile/${profileId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('error');

      setProfiles((prev) => prev.filter((profile) => profile.id !== profileId));

      openToast('success', 'プロフィールを削除しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  return (
    <div className='flex flex-col items-start w-screen gap-4 p-6 max-w-screen sm:p-12 sm:max-w-screen-xl'>
      <Heading label='ダッシュボード' />

      <p className='text-sm font-bold text-black'>フォーム一覧</p>
      <p className='text-sm text-black'>{`${FORM_COUNT_LIMIT}件まで作成可能です`}</p>

      <Table
        headers={['フォーム名', '概要', '共有URL', '編集', '削除']}
        data={tableFormRows}
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

      <p className='text-sm font-bold text-black'>プロフィール一覧</p>
      <p className='text-sm text-black'>{`${PROFILE_COUNT_LIMIT}件まで作成可能です`}</p>

      <Table
        headers={['プロフィール名', '編集', '削除']}
        data={profileTableRows}
        formIds={formIds}
        onDelete={handleDeleteProfile}
      />

      <Button
        type='submit'
        theme='primary'
        svgComponent={(className) => <PlusIcon className={className} />}
        onClick={handleAddProfile}
      >
        新規作成
      </Button>
    </div>
  );
};
