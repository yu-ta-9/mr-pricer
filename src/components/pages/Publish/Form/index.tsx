import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

import { postSchema } from '@/app/api/p/result/schema';
import { Field } from '@/components/pages/Publish/Form/fields';
import { Result } from '@/components/pages/Publish/Profile/Result';
import { usePublishPageContext } from '@/components/pages/Publish/usePublishPageContext';
import { Button } from '@/components/ui/Button';
import { Heading } from '@/components/ui/Heading';
import { LoadingIcon } from '@/components/ui/LoadingIcon';
import { useToast } from '@/hooks/useToast';

import type { postSchemaType } from '@/app/api/p/result/schema';
import type { FC } from 'react';

export const Form: FC = () => {
  const { openToast } = useToast();
  const { formData, calculate } = usePublishPageContext();
  const methods = useForm<postSchemaType>({
    resolver: zodResolver(postSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      friendlyKey: formData?.friendlyKey,
      fields: [],
    },
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<number>();

  const handleSubmit = async () => {
    await methods.trigger();
    if (!methods.formState.isValid) {
      // TODO: 条件分岐に基づくバリデーションを作る
      openToast('error', '未入力の項目があります');
      return;
    }

    setIsCalculating(true);

    // 見積もり計算
    const data = methods.getValues();
    const result = calculate(data);

    // TODO: API不要になったら消す
    // const res = await fetch('/api/p/result', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ friendlyKey: data.friendlyKey, fields: data.fields }),
    // });
    // const json = await res.json();

    setResult(result);
    setIsCalculating(false);
  };

  return (
    <FormProvider {...methods}>
      <div className='flex flex-col w-full gap-4'>
        <Heading label='依頼したい内容を入力してください' customColor={formData?.profile?.profileTheme || undefined} />

        {formData?.fields.map((field, i) => (
          <Field key={field.id} index={i} field={field} conditionFieldIndexes={[]} />
        ))}

        {result === undefined ? (
          isCalculating ? (
            <LoadingIcon />
          ) : (
            <Button
              theme='primary'
              type='button'
              onClick={handleSubmit}
              customColor={formData?.profile?.profileTheme || undefined}
            >
              お見積額計算
            </Button>
          )
        ) : (
          <Result result={result} isCalculating={isCalculating} onCalculate={handleSubmit} />
        )}
      </div>
    </FormProvider>
  );
};
