import { PencilIcon, TrashIcon } from '@heroicons/react/24/solid';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';

import { Tooltip } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
} as Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Template: Story = {
  args: {
    verticalPosition: 'top',
    horizontalPosition: 'left',
    verticalOffset: 0,
    horizontalOffset: 0,
    options: [
      {
        label: '選択肢1',
        onClick: () => alert('click 1'),
        svgComponent: (className) => <PencilIcon className={className} />,
      },
      {
        label: '選択肢2',
        onClick: () => alert('click 2'),
        isDanger: true,
        svgComponent: (className) => <TrashIcon className={className} />,
      },
      {
        label: '選択肢3',
        onClick: () => alert('click 3'),
      },
    ],
  },
  render: function Comp({ ...args }) {
    const [isOpen, setIsOpen] = useState(false);
    const basisRef = useRef<HTMLButtonElement>(null);

    return (
      <>
        <Button ref={basisRef} theme='primary' type='button' onClick={() => setIsOpen(true)}>
          Open
        </Button>

        <Tooltip {...args} basisRef={basisRef.current} isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </>
    );
  },
};
