import { useArgs } from '@storybook/client-api';

import { ToggleButton } from '.';

import type { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  component: ToggleButton,
} as ComponentMeta<typeof ToggleButton>;

export const Template: ComponentStory<typeof ToggleButton> = (_args) => {
  const [args, updateArgs] = useArgs();

  return <ToggleButton isOn={args.isOn} onToggle={(): void => updateArgs({ isOn: !args.isOn })} />;
};
