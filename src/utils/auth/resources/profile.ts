import { prisma } from '@/lib/prisma';

export const authProfile = async (userId: string, profileId: number) => {
  await prisma.profile.findFirstOrThrow({
    where: {
      userId,
      id: profileId,
    },
  });
};
