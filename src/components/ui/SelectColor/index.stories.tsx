import { useState } from 'react';

import { SelectColor } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SelectColor> = {
  component: SelectColor,
} as Meta<typeof SelectColor>;

export default meta;
type Story = StoryObj<typeof SelectColor>;

export const Template: Story = {
  args: {},
  render: function Comp({ ...args }) {
    const [value, setValue] = useState('#000');

    return (
      <SelectColor
        {...args}
        value={value}
        onChange={(value) => {
          setValue(value);
        }}
      />
    );
  },
};
