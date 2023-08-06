import { useState } from 'react';

import { ColorPicker } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ColorPicker> = {
  component: ColorPicker,
} as Meta<typeof ColorPicker>;

export default meta;
type Story = StoryObj<typeof ColorPicker>;

export const Template: Story = {
  args: {},
  render: function Comp({ ...args }) {
    const [value, setValue] = useState('#fff');

    return (
      <ColorPicker
        {...args}
        value={value}
        onChangeComplete={(color) => {
          setValue(color.hex);
        }}
      />
    );
  },
};
