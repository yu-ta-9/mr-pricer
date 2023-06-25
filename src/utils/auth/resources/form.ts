import { prisma } from '@/lib/prisma';

export const authForm = async (userId: string, formId: number) => {
  await prisma.form.findFirstOrThrow({
    where: {
      userId,
      id: formId,
    },
  });
};
