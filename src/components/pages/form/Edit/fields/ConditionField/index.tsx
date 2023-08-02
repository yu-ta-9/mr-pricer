import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import { FieldType } from '@prisma/client';
import { useMemo, type FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Field } from '@/components/pages/form/Edit/fields';
import { getRecursiveErrorForAdmin } from '@/components/pages/Publish/utils/hookForm';
import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/hooks/useToast';
import { FIELD_CONDITION_BRANCH_LIMIT, FIELD_COUNT_LIMIT } from '@/utils/validation/field';

import type { putSchemaType } from '@/app/api/admin/form/[formId]/field/[fieldId]/schema';
import type { FormForm, ParsedField } from '@/components/pages/form/Edit/type';

type Props = {
  index: number;
  name: `fields.${number}`;
  field: ParsedField;
  conditionFieldIndexes: number[];
};

export const ConditionField: FC<Props> = ({ index, name, field, conditionFieldIndexes }) => {
  const { formId } = field;

  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<FormForm>();
  const {
    fields: conditionFieldChildFields,
    append,
    remove,
  } = useFieldArray({
    control,
    // TODO: 違う方法にしたい
    name: `${name}.fields` as 'fields',
    keyName: 'hookFormArrayKey',
  });
  const { openToast } = useToast();
  const fieldConditionBranches = useFieldArray({
    control,
    name: `${name}.fieldCondition.fieldConditionBranches`,
    keyName: 'hookFormArrayKey',
  });

  const isEnableDeleteOption = useMemo(
    () => fieldConditionBranches.fields.length > 1,
    [fieldConditionBranches.fields.length],
  );

  const handleDeleteOption = (
    i: number,
    fieldConditionBranch: NonNullable<FormForm['fields'][number]['fieldCondition']>['fieldConditionBranches'][number],
  ) => {
    fieldConditionBranches.remove(i);
    // MEMO: 削除マーカーを付与
    if (fieldConditionBranch.id !== 0) {
      setValue(`${name}.fieldCondition.deleteOptionIds`, [
        ...(getValues(`${name}.fieldCondition.deleteOptionIds`) || []),
        fieldConditionBranch.id,
      ]);
    }
  };

  const handleUpdate = async () => {
    try {
      const fieldValue = getValues(name);
      const { name: fieldName, description, fieldCondition } = fieldValue;

      const param: putSchemaType = {
        type: FieldType.CONDITION,
        name: fieldName,
        description,
        options:
          fieldCondition?.fieldConditionBranches.map((option) => ({
            id: option.id,
            label: option.label,
          })) || [],
        deleteOptionIds: fieldCondition?.deleteOptionIds || [],
      };

      const res = await fetch(`/api/admin/form/${getValues('id')}/field/${getValues(`${name}.id`)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(param),
      });

      if (!res.ok) throw new Error('error');

      // MEMO: 各オプションにidを付与し、増分判定から除外できるようにする
      const data = await res.json();
      const newFieldConditionBranchValue = fieldCondition?.fieldConditionBranches.map((option, i) => ({
        ...option,
        id: data.fieldCondition.fieldConditionBranches[i].id,
      }));
      setValue(`${name}.fieldCondition.fieldConditionBranches`, newFieldConditionBranchValue || []);

      openToast('success', 'フィールドを更新しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  /**
   * フィールド追加（条件分岐内）
   */
  const handleAddField = async (type: FieldType) => {
    try {
      const parentConditionId = getValues(`${name}.fieldCondition.id`);
      const res = await fetch(`/api/admin/form/${formId}/field`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          parentConditionId: parentConditionId || undefined,
        }),
      });

      if (!res.ok) throw new Error('error');

      const data = await res.json();
      append(data);

      openToast('success', 'フィールドを作成しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  /**
   * フィールド削除（条件分岐内）
   * @param index
   */
  const handleDeleteField = async (index: number) => {
    try {
      // TODO: アサーションやめたい
      await fetch(
        `/api/admin/form/${formId}/field/${getValues(`${name}.fields.${index}.id` as `fields.${number}.id`)}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      remove(index);
      openToast('success', '削除しました');
    } catch (err) {
      openToast('error', 'エラーが発生しました');
    }
  };

  return (
    <>
      <Input {...register(`${name}.name`)} label='設問名' type='text' placeholder='設問名を入力' />

      {fieldConditionBranches.fields.map((fieldConditionBranch, i) => (
        <div key={fieldConditionBranch.hookFormArrayKey} className='flex items-center gap-2'>
          <Input
            {...register(`${name}.fieldCondition.fieldConditionBranches.${i}.label`)}
            label={`分岐${i + 1}`}
            type='text'
            placeholder='入力してください'
            fullWidth
            error={getRecursiveErrorForAdmin(name, errors)?.fieldCondition?.fieldConditionBranches?.[i]?.label?.message}
          />

          {/* TODO: やや強引な下揃え配置になっている */}
          {isEnableDeleteOption && (
            <IconButton
              theme='danger'
              className='self-end mb-1'
              svgComponent={(className) => <TrashIcon className={className} />}
              onClick={() => handleDeleteOption(i, fieldConditionBranch)}
            />
          )}
        </div>
      ))}

      <Button
        className='self-end'
        theme='primary'
        type='button'
        svgComponent={(className) => <PlusIcon className={className} />}
        // MEMO: idが未採番なので0を入れる
        onClick={() =>
          fieldConditionBranches.append({ label: '', id: 0, fieldConditionId: getValues(`${name}.fieldCondition.id`) })
        }
        disabled={fieldConditionBranches.fields.length >= FIELD_CONDITION_BRANCH_LIMIT}
      >
        追加
      </Button>

      <p className='self-end text-black text-normal'>分岐は{FIELD_CONDITION_BRANCH_LIMIT}個まで追加できます。</p>

      <Button theme='primary' type='button' onClick={handleUpdate} disabled={false}>
        更新
      </Button>

      {conditionFieldChildFields.map((childField, i) => (
        <Field
          key={childField.id}
          index={i}
          field={childField}
          onDelete={handleDeleteField}
          conditionParams={{ field, conditionFieldIndexes: [...conditionFieldIndexes, index] }}
        />
      ))}

      <div className='flex items-center gap-2'>
        <Button
          theme='primary'
          type='button'
          svgComponent={(className) => <PlusIcon className={className} />}
          onClick={() => handleAddField(FieldType.SELECT)}
        >
          選択入力
        </Button>

        <Button
          theme='primary'
          type='button'
          svgComponent={(className) => <PlusIcon className={className} />}
          onClick={() => handleAddField(FieldType.NUMBER)}
        >
          数値入力
        </Button>
      </div>

      <p className='text-black text-normal'>条件分岐含めて{FIELD_COUNT_LIMIT}個まで追加できます。</p>
    </>
  );
};
