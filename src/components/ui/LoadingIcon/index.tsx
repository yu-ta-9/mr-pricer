import type { FC } from 'react';

export const LoadingIcon: FC = () => {
  return (
    <div
      className='w-10 h-10 border-4 rounded-full border-t-transparent border-primary animate-spin'
      // MEMO: なぜか`border-t-transparent`が効かないので直書き
      style={{ borderTopColor: 'transparent' }}
    ></div>
  );
};
