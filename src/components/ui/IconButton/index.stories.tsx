import { TrashIcon, PlusCircleIcon } from '@heroicons/react/24/solid';

import { IconButton } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
} as Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = {
  args: {
    theme: 'primary',
    svgComponent: (className) => <PlusCircleIcon className={className} />,
    onClick: () => window.alert('button clicked!!'),
  },
};

export const Secondary: Story = {
  args: {
    theme: 'secondary',
    svgComponent: (className) => <PlusCircleIcon className={className} />,
    onClick: () => window.alert('button clicked!!'),
  },
};

export const Danger: Story = {
  args: {
    theme: 'danger',
    svgComponent: (className) => <TrashIcon className={className} />,
    onClick: () => window.alert('button clicked!!'),
  },
};
