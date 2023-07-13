import { DashBoard } from '@/components/pages/DashBoard';
import { prisma } from '@/lib/prisma';
import { ToastProvider } from '@/providers/ToastProvider';
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

  return (
    <ToastProvider>
      <DashBoard formsData={forms} profilesData={profiles} />
    </ToastProvider>
  );
};

export default DashboardPage;
