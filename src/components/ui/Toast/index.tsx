import { CheckIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

import { customStyle } from '@/components/ui/Toast/customStyle';

import type { CustomColor } from '@/components/ui/type';
import type { ToastType } from '@/contexts/ToastContext';
import type { FC } from 'react';

type Props = { isShow: boolean; type: ToastType; message: string } & CustomColor;

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

export const Toast: FC<Props> = ({ isShow, type, message, customColor }) => {
  return (
    <div
      css={customStyle(customColor)}
      className={`text-white toast ${isShow ? 'toast-show' : 'toast-hide'}`}
      style={{ backgroundColor: customColor?.primaryColor, color: customColor?.textColor }}
    >
      {getIcon(type)}

      <span className='text-sm'>{message}</span>
    </div>
  );
};
