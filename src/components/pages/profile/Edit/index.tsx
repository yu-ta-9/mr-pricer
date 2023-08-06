'use client';

import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { Controller, FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Heading } from '@/components/ui/Heading';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { SelectColor } from '@/components/ui/SelectColor';
import { Textarea } from '@/components/ui/Textarea';
import { useToast } from '@/hooks/useToast';
import { COLOR_PALETTE } from '@/utils/styles/palette';
import { PROFILE_LINK_COUNT_LIMIT } from '@/utils/validation/profile';

import type { ProfileForm } from '@/components/pages/profile/Edit/type';
import type { SubmitHandler } from 'react-hook-form';

type Props = {
  profileData: ProfileForm;
  profileIconUrl?: string;
};

export const Edit: FC<Props> = ({ profileData, profileIconUrl }) => {
  const router = useRouter();
  const { openToast } = useToast();
  const profileFormMethods = useForm<ProfileForm>({
    defaultValues: {
      ...profileData,
      profileTheme: {
        primaryColor: profileData.profileTheme?.primaryColor || COLOR_PALETTE.primary,
        formBackgroundColor: profileData.profileTheme?.formBackgroundColor || COLOR_PALETTE.white,
        contentBackgroundColor: profileData.profileTheme?.contentBackgroundColor || COLOR_PALETTE.white,
        textColor: profileData.profileTheme?.textColor || COLOR_PALETTE.black,
        borderColor: profileData.profileTheme?.borderColor || COLOR_PALETTE.basePrimary,
      },
    },
    mode: 'onChange',
  });
  const profileLinkFields = useFieldArray({
    control: profileFormMethods.control,
    name: 'profileLinks',
    keyName: 'fieldId',
  });

  const [iconUrl, setIconUrl] = useState<string | undefined>(profileIconUrl);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length === 0) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1000 * 1000) {
      openToast('error', '5MB以下のみ登録可能です');
      e.currentTarget.value = '';
      return;
    }

    try {
      const body = new FormData();
      body.append('iconFile', file);

      const profileId = profileFormMethods.getValues('id');
      const res = await fetch(`/api/admin/profile/${profileId}/icon`, {
        method: 'POST',
        body,
      });

      if (!res.ok) throw new Error('error');

      const resJson = await res.json();
      profileFormMethods.setValue('iconKey', resJson.profile.iconKey);
      setIconUrl(resJson.iconUrl);

      openToast('success', 'プロフィール画像を更新しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
      e.currentTarget.value = '';
    }
  };

  const handleDeleteImage = async () => {
    const profileIconKey = profileFormMethods.getValues('iconKey');
    if (!profileIconKey) return;

    try {
      const profileId = profileFormMethods.getValues('id');
      const res = await fetch(`/api/admin/profile/${profileId}/icon/${profileIconKey}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('error');

      profileFormMethods.setValue('iconKey', null);
      setIconUrl(undefined);

      openToast('success', 'プロフィール画像を削除しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
    try {
      const { name, content, profileLinks, deleteProfileLinksIds, profileTheme } = data;
      const res = await fetch(`/api/admin/profile/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name,
          content,
          profileLinks: profileLinks.map((profileLink) => ({
            id: profileLink.id,
            label: profileLink.label,
            url: profileLink.url,
          })),
          deleteProfileLinksIds,
          profileTheme,
        }),
      });

      if (!res.ok) throw new Error('error');

      const resJson = await res.json();
      // upsert用にリンクにIDを添える
      const newProfileLinks = resJson.profileLinks.map((profileLink: ProfileForm['profileLinks'][number]) => ({
        ...profileLink,
        id: profileLink.id || undefined,
      }));
      profileFormMethods.setValue('profileLinks', newProfileLinks);

      openToast('success', 'プロフィールを更新しました');
    } catch (err) {
      console.error(err);
      openToast('error', 'エラーが発生しました');
    }
  };

  return (
    <FormProvider {...profileFormMethods}>
      <div className='flex flex-col items-start w-full gap-4 p-6 max-w-screen sm:p-12 sm:max-w-screen-xl'>
        <form
          className='flex flex-col items-start w-full max-w-5xl gap-4'
          onSubmit={profileFormMethods.handleSubmit(onSubmit)}
        >
          <Button
            theme='primary'
            type='button'
            svgComponent={(className) => <ArrowLeftIcon className={className} />}
            onClick={() => router.back()}
          >
            戻る
          </Button>

          <Heading label='プロフィール編集' />

          <FileUpload
            label='プロフィール画像'
            fileUrl={iconUrl}
            onChange={handleUploadImage}
            onRemove={handleDeleteImage}
          />

          <Input
            {...profileFormMethods.register('name')}
            label='プロフィール名'
            type='text'
            placeholder='プロフィール名を入力'
            fullWidth
          />

          <Textarea
            {...profileFormMethods.register('content')}
            label='自己紹介'
            placeholder='自己紹介を入力'
            fullWidth
            rows={5}
          />

          <p className='text-black text-normal'>リンク</p>

          {profileLinkFields.fields.map((field, i) => (
            <div key={field.fieldId} className='flex items-center w-full gap-4'>
              <Input
                {...profileFormMethods.register(`profileLinks.${i}.label`)}
                label='リンク名'
                type='text'
                placeholder='リンク名を入力'
                fullWidth
              />

              <Input
                {...profileFormMethods.register(`profileLinks.${i}.url`)}
                label='URL'
                type='url'
                placeholder='URLを入力'
                fullWidth
              />

              <IconButton
                theme='danger'
                className='self-end mb-1'
                svgComponent={(className) => <TrashIcon className={className} />}
                onClick={() => {
                  profileLinkFields.remove(i);
                  // MEMO: 削除マーカーを付与
                  if (field.id !== undefined) {
                    profileFormMethods.setValue('deleteProfileLinksIds', [
                      ...(profileFormMethods.getValues('deleteProfileLinksIds') || []),
                      field.id,
                    ]);
                  }
                }}
              />
            </div>
          ))}

          <Button
            type='button'
            theme='primary'
            onClick={() => profileLinkFields.append({ id: 0, profileId: profileData.id, label: '', url: '' })}
            disabled={profileLinkFields.fields.length >= PROFILE_LINK_COUNT_LIMIT}
          >
            追加
          </Button>

          <p className='text-black text-normal'>{PROFILE_LINK_COUNT_LIMIT}個まで追加できます。</p>

          <p className='text-black text-normal'>テーマ設定</p>

          <section className='flex flex-col w-full gap-4 p-4 border-2 rounded border-primary'>
            <p className='text-black text-normal'>メイン色</p>

            <Controller
              control={profileFormMethods.control}
              name='profileTheme.primaryColor'
              render={({ field: { value, onChange } }) => (
                <SelectColor
                  value={value}
                  onChange={(value) => {
                    onChange(value);
                  }}
                />
              )}
            />

            <p className='text-black text-normal'>フォーム背景色</p>

            <Controller
              control={profileFormMethods.control}
              name='profileTheme.formBackgroundColor'
              render={({ field: { value, onChange } }) => (
                <SelectColor
                  value={value}
                  onChange={(value) => {
                    onChange(value);
                  }}
                />
              )}
            />

            <p className='text-black text-normal'>コンテンツ背景色</p>

            <Controller
              control={profileFormMethods.control}
              name='profileTheme.contentBackgroundColor'
              render={({ field: { value, onChange } }) => (
                <SelectColor
                  value={value}
                  onChange={(value) => {
                    onChange(value);
                  }}
                />
              )}
            />

            <p className='text-black text-normal'>文字色</p>

            <Controller
              control={profileFormMethods.control}
              name='profileTheme.textColor'
              render={({ field: { value, onChange } }) => (
                <SelectColor
                  value={value}
                  onChange={(value) => {
                    onChange(value);
                  }}
                />
              )}
            />

            <p className='text-black text-normal'>枠線色</p>

            <Controller
              control={profileFormMethods.control}
              name='profileTheme.borderColor'
              render={({ field: { value, onChange } }) => (
                <SelectColor
                  value={value}
                  onChange={(value) => {
                    onChange(value);
                  }}
                />
              )}
            />
          </section>

          <Button className='self-end' theme='primary' type='submit'>
            更新
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};
