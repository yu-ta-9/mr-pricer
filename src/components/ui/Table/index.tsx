import type { FC } from 'react';

export type Cell = {
  type: 'text' | 'link';
  value: any;
};

type Props = { headers: string[]; data: any[][]; formIds: number[]; onDelete: (formId: number) => void };

export const Table: FC<Props> = ({ headers, data }) => {
  return (
    <div className='relative w-full overflow-x-auto shadow-md sm:rounded-lg'>
      <table className='w-full text-sm text-left text-black'>
        <thead className='text-xs text-white uppercase bg-base-primary'>
          <tr>
            {headers.map((header, i) => (
              <th key={i} scope='col' className='px-6 py-3 break-keep'>
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className='bg-white border-b hover:bg-gray-50'>
              {row.map((cell, j) => (
                <td key={j} className='px-6 py-4 break-keep'>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
