import { useState } from 'react';

import { RadioGroup } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
} as Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Template: Story = {
  args: {
    label: 'Label',
    name: 'sb',
    options: [
      { label: 'option1', value: 'value1' },
      { label: 'option2', value: 'value2' },
      { label: 'option3', value: 'value3' },
    ],
  },
  render: function Comp({ ...args }) {
    const [value, setValue] = useState('value1');

    return <RadioGroup {...args} value={value} onChange={(value) => setValue(value as string)} />;
  },
};
