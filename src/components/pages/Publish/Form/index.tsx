import { useState } from 'react';

import { Field } from '@/components/pages/Publish/Form/fields';
import { Result } from '@/components/pages/Publish/Profile/Result';
import { usePublishPageContext } from '@/components/pages/Publish/usePublishPageContext';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { LoadingIcon } from '@/components/ui/LoadingIcon';

import type { FC } from 'react';

export const Form: FC = () => {
  const { formData } = usePublishPageContext();

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState();

  const handleSubmit = async () => {
    setIsCalculating(true);

    await new Promise((resolve) => setTimeout(resolve, 500));

    setResult(undefined);

    setIsCalculating(false);
    // await fetch('/api/form', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ content: 'test' }),
    // });
  };

  return (
    <div className='flex flex-col w-full gap-4'>
      <Heading label='依頼したい内容を入力してください' />

      {formData?.fields.map((field, i) => (
        <Field key={field.id} index={i} field={field} />
      ))}

      {result === undefined ? (
        isCalculating ? (
          <LoadingIcon />
        ) : (
          <Button theme='primary' type='button' onClick={handleSubmit}>
            お見積額計算
          </Button>
        )
      ) : (
        <Result isCalculating={isCalculating} onCalculate={handleSubmit} />
      )}
    </div>
  );
};
