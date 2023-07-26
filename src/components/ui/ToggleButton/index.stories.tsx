import { useState } from 'react';

import { ToggleButton } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ToggleButton> = {
  component: ToggleButton,
} as Meta<typeof ToggleButton>;

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Template: Story = {
  args: {
    label: 'Label',
  },
  render: function Comp({ ...args }) {
    const [isOn, setIsOn] = useState(false);

    return <ToggleButton {...args} isOn={isOn} onToggle={() => setIsOn((prev) => !prev)}></ToggleButton>;
  },
};
