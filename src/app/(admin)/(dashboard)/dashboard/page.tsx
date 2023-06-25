import { DashBoard } from '@/components/pages/DashBoard';
import { prisma } from '@/lib/prisma';
import { getAuthenticateSession } from '@/utils/server/auth';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Dashboard',
};

const DashboardPage = async () => {
  const session = await getAuthenticateSession();

  const forms = await prisma.form.findMany({ where: { userId: session.user!.id }, orderBy: { id: 'asc' } });
  const profiles = await prisma.profile.findMany({ where: { userId: session.user!.id }, orderBy: { id: 'asc' } });

  return <DashBoard formsData={forms} profilesData={profiles} />;
};

export default DashboardPage;
