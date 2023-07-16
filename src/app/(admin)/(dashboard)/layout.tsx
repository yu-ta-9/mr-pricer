import { Dashboard } from '@/components/layouts/Dashboard';
import { ToastProvider } from '@/providers/ToastProvider';

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastProvider>
      <Dashboard>{children}</Dashboard>
    </ToastProvider>
  );
};

export default DashboardLayout;
