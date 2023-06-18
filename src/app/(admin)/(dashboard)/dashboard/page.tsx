import { getServerSession } from 'next-auth';

import { DashBoard } from '@/components/pages/DashBoard';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session || session.user === undefined) {
    throw new Error('session is undefined');
  }
  const forms = await prisma.form.findMany({ where: { userId: session.user.id }, orderBy: { id: 'asc' } });

  return <DashBoard formsData={forms} />;
};

export default DashboardPage;
