import { PlusIcon } from '@heroicons/react/24/solid';

import { Button } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  component: Button,
} as Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: <>Button</>,
    theme: 'primary',
    type: 'button',
    onClick: () => window.alert('button clicked!!'),
  },
};

export const Secondary: Story = {
  args: {
    children: <>Button</>,
    theme: 'secondary',
    type: 'button',
    onClick: () => window.alert('button clicked!!'),
  },
};

export const Danger: Story = {
  args: {
    children: <>Button</>,
    theme: 'danger',
    type: 'button',
    onClick: () => window.alert('button clicked!!'),
  },
};

export const WithIcon: Story = {
  args: {
    children: <>Button</>,
    theme: 'primary',
    type: 'button',
    svgComponent: (className) => <PlusIcon className={className} />,
    onClick: () => window.alert('button clicked!!'),
  },
};
