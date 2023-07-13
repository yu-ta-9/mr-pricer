import { CheckIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import type { ToastType } from '@/contexts/ToastContext';
import type { FC } from 'react';

type Props = { isShow: boolean; type: ToastType; message: string };

const getIcon = (type: Props['type']) => {
  switch (type) {
    case 'success':
      return <CheckIcon className='w-5 h-5 p-1 text-white rounded-full bg-success' />;
    case 'error':
      return <XMarkIcon className='w-5 h-5 p-1 text-white rounded-full bg-danger' />;
    case 'info':
      return <InformationCircleIcon className='w-5 h-5 p-1 text-white rounded-full bg-info bg-success' />;
  }
};

export const Toast: FC<Props> = ({ isShow, type, message }) => {
  return (
    <div className={`toast ${isShow ? 'toast-show' : 'toast-hide'}`}>
      {getIcon(type)}

      <span className='text-sm text-white'>{message}</span>
    </div>
  );
};
