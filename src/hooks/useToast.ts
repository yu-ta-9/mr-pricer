import { useContext } from 'react';

import { ToastContext } from '@/contexts/ToastContext';

export const useToast = () => {
  const { openToast } = useContext(ToastContext);

  return {
    openToast,
  };
};
