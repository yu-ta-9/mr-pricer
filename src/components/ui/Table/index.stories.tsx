import { Table } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Table> = {
  component: Table,
} as Meta<typeof Table>;

export default meta;
type Story = StoryObj<typeof Table>;

export const Template: Story = {
  args: {
    headers: [],
    data: [[]],
    formIds: [],
  },
};
