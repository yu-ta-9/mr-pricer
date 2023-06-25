'use client';

import { ArrowLeftIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/navigation';
import { useState, type FC } from 'react';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { FileUpload } from '@/components/ui/FileUpload';
import { Heading } from '@/components/ui/Heading';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

import type { ProfileForm } from '@/components/pages/profile/Edit/type';
import type { SubmitHandler } from 'react-hook-form';

type Props = {
  profileData: ProfileForm;
  profileIconUrl?: string;
};

export const Edit: FC<Props> = ({ profileData, profileIconUrl }) => {
  const router = useRouter();
  const profileFormMethods = useForm<ProfileForm>({ defaultValues: profileData, mode: 'onChange' });
  const profileLinkFields = useFieldArray({
    control: profileFormMethods.control,
    name: 'profileLinks',
    keyName: 'fieldId',
  });

  const [iconUrl, setIconUrl] = useState<string | undefined>(profileIconUrl);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null || e.target.files.length === 0) return;

    try {
      const body = new FormData();
      body.append('iconFile', e.target.files[0]);

      const profileId = profileFormMethods.getValues('id');
      const res = await fetch(`/api/admin/profile/${profileId}/icon`, {
        method: 'POST',
        body,
      });

      if (!res.ok) throw new Error('error');

      const resJson = await res.json();
      profileFormMethods.setValue('iconKey', resJson.profile.iconKey);
      setIconUrl(resJson.iconUrl);

      window.alert('プロフィール画像を更新しました');
    } catch (err) {
      console.error(err);
      window.alert('エラーが発生しました');
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

      window.alert('プロフィール画像を削除しました');
    } catch (err) {
      console.error(err);
      window.alert('エラーが発生しました');
    }
  };

  const onSubmit: SubmitHandler<ProfileForm> = async (data) => {
    try {
      // TODO: formData verの覚書
      // const body = new FormData();
      // body.append('name', data.name);
      // body.append('content', data.content);
      // if (data.iconFile !== undefined && data.iconFile.length > 0) {
      //   body.append('iconFile', data.iconFile[0]);
      // }
      // if (data.iconKey) {
      //   body.append('iconKey', data.iconKey);
      // }
      // data.profileLinks.forEach((profileLink, i) => {
      //   if (profileLink.id !== undefined) {
      //     body.append(`profileLinks[${i}][id]`, String(profileLink.id));
      //   }
      //   body.append(`profileLinks[${i}][label]`, profileLink.label);
      //   body.append(`profileLinks[${i}][url]`, profileLink.url);
      // });
      // data.deleteProfileLinksIds?.forEach((id, i) => {
      //   body.append(`deleteProfileLinksIds[${i}]`, String(id));
      // });

      const res = await fetch(`/api/admin/profile/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: data.name,
          content: data.content,
          profileLinks: data.profileLinks.map(profileLink => ({
            id: profileLink.id,
            label: profileLink.label,
            url: profileLink.url,
          })),
          deleteProfileLinksIds: data.deleteProfileLinksIds,
        }),
      });

      if (!res.ok) throw new Error('error');

      const resJson = await res.json();
      // upsert用にリンクにIDを添える
      const profileLinks = resJson.profileLinks.map((profileLink: ProfileForm['profileLinks'][number]) => ({
        ...profileLink,
        id: profileLink.id || undefined,
      }));
      profileFormMethods.setValue('profileLinks', profileLinks);

      window.alert('プロフィールを更新しました');
    } catch (err) {
      console.error(err);
      window.alert('エラーが発生しました');
    }
  };

  return (
    <FormProvider {...profileFormMethods}>
      <div className='flex flex-col items-start w-full max-w-5xl gap-4'>
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

          <Button type='button' theme='primary' onClick={() => profileLinkFields.append({ label: '', url: '' })}>
            追加
          </Button>

          <Button className='self-end' theme='primary' type='submit'>
            更新
          </Button>
        </form>
      </div>
    </FormProvider>
  );
};
