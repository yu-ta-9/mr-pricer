import { useRef, type FC, useState } from 'react';

import { ColorPicker } from '@/components/ui/ColorPicker';
import { TooltipContainer } from '@/components/ui/TooltipContainer';

type Props = {
  value?: string;
  /** default: #fff */
  defaultValue?: string;
  onChange: (value: string) => void;
};

export const SelectColor: FC<Props> = ({ value, defaultValue = '#fff', onChange }) => {
  const basisRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  return (
    <>
      <div className='flex items-center gap-2'>
        <div
          role='button'
          ref={basisRef}
          className='w-6 h-6 rounded-full shadow cursor-pointer'
          style={{ backgroundColor: value }}
          onClick={open}
        ></div>

        <span className='text-sm'>{value}</span>
      </div>

      <TooltipContainer
        basisRef={basisRef.current}
        isOpen={isOpen}
        onClose={close}
        verticalPosition='top'
        verticalOffset={4}
        horizontalPosition='left'
      >
        <ColorPicker
          value={value || defaultValue}
          onChange={(color) => onChange(color.hex)}
          onChangeComplete={(color) => onChange(color.hex)}
        />
      </TooltipContainer>
    </>
  );
};
