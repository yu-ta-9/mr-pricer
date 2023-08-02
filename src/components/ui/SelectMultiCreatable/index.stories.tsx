import { SelectMultiCreatable } from '.';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SelectMultiCreatable> = {
  component: SelectMultiCreatable,
} as Meta<typeof SelectMultiCreatable>;

export default meta;
type Story = StoryObj<typeof SelectMultiCreatable>;

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
