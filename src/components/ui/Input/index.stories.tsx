import { Input } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  component: Input,
} as Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof Input>;

export const Template: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    type: 'text',
  },
};
