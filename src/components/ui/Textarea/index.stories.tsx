import { Textarea } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Textarea> = {
  component: Textarea,
} as Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Template: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
  },
};
