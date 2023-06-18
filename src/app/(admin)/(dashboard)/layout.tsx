import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { Dashboard } from '@/components/layouts/Dashboard';
import { authOptions } from '@/lib/auth';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('signIn');
  }

  return <Dashboard>{children}</Dashboard>;
};

export default DashboardLayout;
