import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingIcon } from '@/components/ui/LoadingIcon';
import { TextLink } from '@/components/ui/TextLink';

import type { FC } from 'react';

type Props = { isCalculating: boolean; onCalculate: () => void };

export const Result: FC<Props> = ({ isCalculating, onCalculate }) => {
  const handleMoveToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <section className='flex flex-col w-full gap-4 p-4 border-2 rounded-lg border-primary'>
      <p className='font-bold text-normal'>お見積り</p>
      <h2 className='text-2xl font-bold'>200,000円（税抜）</h2>

      <div className='flex items-center gap-2'>
        ご依頼内容を変更して再計算が可能です。
        <IconButton
          svgComponent={(className) => <ArrowUpCircleIcon className={className} />}
          onClick={handleMoveToTop}
          theme='primary'
        />
      </div>

      {isCalculating ? (
        <LoadingIcon />
      ) : (
        <Button theme='primary' type='button' onClick={onCalculate}>
          再計算
        </Button>
      )}

      <p className='font-bold text-normal'>xxさんへのご依頼はこちらから！</p>

      <TextLink type='external' label='Twitter' href='https://twitter.com/yuta9_drumming' />
    </section>
  );
};
