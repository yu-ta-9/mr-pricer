import { LoadingIcon } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof LoadingIcon> = {
  component: LoadingIcon,
} as Meta<typeof LoadingIcon>;

export default meta;
type Story = StoryObj<typeof LoadingIcon>;

export const Template: Story = {
  args: {
    size: 24,
  },
};
