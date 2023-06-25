import type { Profile, ProfileLink } from '@prisma/client';

/**
 * プロフィールのhook-form向け型定義
 */
export type ProfileForm = { iconFile?: FileList; deleteProfileLinksIds?: number[] } & Profile & {
    profileLinks:
      | ProfileLink[]
      | (Omit<ProfileLink, 'id' | 'profileId' | 'createdAt' | 'updatedAt'> &
          Partial<Pick<ProfileLink, 'id' | 'profileId' | 'createdAt' | 'updatedAt'>>)[]; // 一部をオプショナルに変更;
  };
