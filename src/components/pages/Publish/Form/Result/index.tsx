import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

import { usePublishPageContext } from '@/components/pages/Publish/usePublishPageContext';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { LoadingIcon } from '@/components/ui/LoadingIcon';
import { TextLink } from '@/components/ui/TextLink';
import { formatToThousandsSeparator } from '@/utils/format';

import type { FC } from 'react';

type Props = { result: number; isCalculating: boolean; onCalculate: () => void };

export const Result: FC<Props> = ({ result, isCalculating, onCalculate }) => {
  const { formData } = usePublishPageContext();
  const handleMoveToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <section
      className='flex flex-col w-full gap-4 p-4 border-2 rounded-lg border-primary'
      style={{
        backgroundColor: formData?.profile?.profileTheme?.contentBackgroundColor,
        borderColor: formData?.profile?.profileTheme?.borderColor,
      }}
    >
      <p className='font-bold text-normal'>お見積り</p>

      <h2 className='text-2xl font-bold'>{formatToThousandsSeparator(result)}円〜</h2>

      <p>※目安となる料金です。ご連絡いただき次第、詳しい内容をお伺いし改めてお見積りいたします。</p>

      <div className='flex items-center gap-2'>
        ご依頼内容を変更して再計算が可能です。
        <IconButton
          svgComponent={(className, style) => <ArrowUpCircleIcon className={className} style={style} />}
          onClick={handleMoveToTop}
          theme='primary'
          customColor={formData?.profile?.profileTheme || undefined}
        />
      </div>

      {isCalculating ? (
        <LoadingIcon />
      ) : (
        <Button
          theme='primary'
          type='button'
          onClick={onCalculate}
          customColor={formData?.profile?.profileTheme || undefined}
        >
          再計算
        </Button>
      )}

      <p className='font-bold text-normal'>{formData?.profile?.name}さんへのご依頼はこちらから！</p>

      {formData?.profile?.profileLinks.map((profileLink) => (
        <TextLink
          key={profileLink.id}
          type='external'
          label={profileLink.label}
          href={profileLink.url}
          customColor={formData?.profile?.profileTheme || undefined}
        />
      ))}
    </section>
  );
};
