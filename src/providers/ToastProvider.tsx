'use client';

import { useEffect, useState } from 'react';

import { Toast } from '@/components/ui/Toast';
import { ToastContext } from '@/contexts/ToastContext';
import { useFade } from '@/hooks/useFade';

import type { ToastType } from '@/contexts/ToastContext';

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShow, setIsShow] = useState(false);
  const [type, setType] = useState<ToastType>('success');
  const [message, setMessage] = useState<string>('');

  const { display } = useFade(isShow);

  useEffect(() => {
    if (isShow) {
      setTimeout(() => {
        setIsShow(false);
      }, 3000);
    }
  }, [isShow]);

  const openToast = (type: ToastType, message: string) => {
    setIsShow(true);
    setType(type);
    setMessage(message);
  };

  return (
    <ToastContext.Provider value={{ openToast }}>
      {children}

      {display && <Toast isShow={isShow} type={type} message={message} />}
    </ToastContext.Provider>
  );
};
