import { TrashIcon } from '@heroicons/react/24/solid';
import { forwardRef } from 'react';

import { IconButton } from '@/components/ui/IconButton';

type Props = {
  label?: string;
  fileUrl?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const FileUpload = forwardRef<HTMLInputElement, Props>(
  ({ label, fileUrl, onChange, onRemove, ...inputProps }, ref) => {
    //const [file, setFile] = useState<File>();

    const handleDelete = () => {
      // setFile(undefined);
      onRemove();
    };

    return (
      <div>
        {label !== undefined && <span className='text-sm'>{label}</span>}

        {/* MEMO: fileUrlが指定されていればそちらで制御する */}
        {fileUrl !== undefined && (
          <div className='flex items-end gap-2 border-base-secondary '>
            <div className='object-cover w-40 h-40 p-4 border-2 border-dotted rounded border-primary'>
              <img src={fileUrl} alt='' className='w-full h-full ' />
            </div>
            <IconButton
              theme='danger'
              svgComponent={(className) => <TrashIcon className={className} />}
              onClick={handleDelete}
            />
          </div>
        )}

        {/* {fileUrl === undefined && file !== undefined && (
          <div className='flex flex-col gap-2'>
            <div className='border-base-secondary '>
              <img src={URL.createObjectURL(file)} alt='' className='object-cover w-32 h-32' />
            </div>

            <IconButton
              theme='danger'
              svgComponent={(className) => <TrashIcon className={className} />}
              onClick={handleDelete}
            />
          </div>
        )} */}

        {fileUrl === undefined && (
          <div className='flex items-center justify-center w-44'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center justify-center w-full h-32 bg-white border-2 border-dashed rounded-lg cursor-pointer border-base-primary hover:bg-primary hover:bg-opacity-50'
            >
              <div className='flex flex-col items-center justify-center p-6'>
                <svg
                  aria-hidden='true'
                  className='w-8 h-8 mb-3 text-black'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12'
                  ></path>
                </svg>

                <p className='text-xs text-black'>PNG, JPG, GIF</p>
              </div>
              <input
                {...inputProps}
                ref={ref}
                id='dropzone-file'
                type='file'
                className='hidden'
                accept='image/png, image/jpg, image/gif'
                onChange={(e) => {
                  // if (e.target.files === null) {
                  //   setFile(undefined);
                  // } else {
                  //   setFile(e.target.files[0]);
                  // }

                  onChange(e);
                }}
              />
            </label>
          </div>
        )}
      </div>
    );
  },
);

FileUpload.displayName = 'FileUpload';
