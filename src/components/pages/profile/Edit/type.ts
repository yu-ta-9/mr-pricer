import { Prisma } from '@prisma/client';

const profileClient = Prisma.validator<Prisma.ProfileArgs>()({
  select: {
    id: true,
    name: true,
    content: true,
    iconKey: true,
    profileLinks: {
      select: {
        id: true,
        profileId: true,
        label: true,
        url: true,
      },
    },
    profileTheme: true,
  },
});
export type ProfileClient = Prisma.ProfileGetPayload<typeof profileClient>;

/**
 * プロフィールのhook-form向け型定義
 */
export type ProfileForm = { iconFile?: FileList; deleteProfileLinksIds?: number[] } & ProfileClient;
