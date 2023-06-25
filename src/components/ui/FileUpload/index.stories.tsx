import { FileUpload } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof FileUpload> = {
  component: FileUpload,
} as Meta<typeof FileUpload>;

export default meta;
type Story = StoryObj<typeof FileUpload>;

export const Template: Story = {
  args: {
    label: 'Label',
  },
};
