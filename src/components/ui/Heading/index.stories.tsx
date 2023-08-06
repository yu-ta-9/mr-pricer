import { Heading } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Heading> = {
  component: Heading,
} as Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof Heading>;

export const Template: Story = {
  args: {
    label: 'Label',
  },
};
