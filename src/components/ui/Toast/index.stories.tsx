import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/useToast';
import { ToastProvider } from '@/providers/ToastProvider';

import { Toast } from '.';

import type { Meta } from '@storybook/react';

export default {
  component: Toast,
} as Meta<typeof Toast>;

export const Template = () => {
  const { openToast } = useToast();

  return (
    <ToastProvider>
      <div className='flex flex-col w-full h-screen gap-2'>
        <Button onClick={() => openToast('success', 'success')} theme='primary' type='button'>
          success
        </Button>

        <Button onClick={() => openToast('error', 'error')} theme='danger' type='button'>
          error
        </Button>
      </div>
    </ToastProvider>
  );
};
