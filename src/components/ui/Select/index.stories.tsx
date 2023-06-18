import { Select } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Select> = {
  component: Select,
} as Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof Select>;

export const Template: Story = {
  args: {
    label: 'Label',
    placeholder: 'Placeholder',
    options: [
      { label: 'option1', value: 'value1' },
      { label: 'option2', value: 'value2' },
      { label: 'option3', value: 'value3' },
    ],
  },
};
