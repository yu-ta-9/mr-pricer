import { createContext } from 'react';

export type ToastType = 'success' | 'error' | 'info';

type ToastContextType = {
  openToast: (type: ToastType, message: string) => void;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ToastContext = createContext<ToastContextType>({ openToast: () => {} });
