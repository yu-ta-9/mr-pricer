'use client';

import { useEffect, useState } from 'react';

import { Toast } from '@/components/ui/Toast';
import { ToastContext } from '@/contexts/ToastContext';
import { useFade } from '@/hooks/useFade';

import type { CustomColor } from '@/components/ui/type';
import type { ToastType } from '@/contexts/ToastContext';

type Props = {
  children: React.ReactNode;
} & CustomColor;

export const ToastProvider = ({ children, customColor }: Props) => {
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

      {display && <Toast isShow={isShow} type={type} message={message} customColor={customColor} />}
    </ToastContext.Provider>
  );
};
