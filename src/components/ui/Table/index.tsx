import { Button } from '@/components/ui/Button';
import { TextLink } from '@/components/ui/TextLink';

import type { FC } from 'react';

export type Cell = {
  type: 'text' | 'link';
  value: any;
};

type Props = { headers: string[]; data: Cell[][]; formIds: number[]; onDelete: (formId: number) => void };

export const Table: FC<Props> = ({ headers, data, formIds, onDelete }) => {
  return (
    <div className='relative w-full overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-black'>
        <thead className='text-xs text-white uppercase bg-base-primary'>
          <tr>
            {headers.map((header, i) => (
              <th key={i} scope='col' className='px-6 py-3'>
                {header}
              </th>
            ))}

            <th scope='col' className='px-6 py-3'>
              <span className='sr-only'>編集</span>
            </th>

            <th scope='col' className='px-6 py-3'>
              <span className='sr-only'>削除</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className='bg-white border-b hover:bg-gray-50'>
              {row.map((cell, j) => (
                <td key={j} className='px-6 py-4'>
                  {cell.type === 'text' && cell.value}
                  {cell.type === 'link' && <TextLink type='external' href={cell.value} label={cell.value} />}
                </td>
              ))}

              <td className='px-6 py-4 text-right'>
                <TextLink type='internal' href={`${formIds[i]}/edit/`} label='編集' />
              </td>

              <td className='px-6 py-4 text-right'>
                <Button theme='danger' type='button' onClick={() => onDelete(formIds[i])}>
                  削除
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
