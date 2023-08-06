import { SketchPicker } from 'react-color';

import type { ComponentProps, FC } from 'react';

type Props = {
  value?: string;
} & ComponentProps<typeof SketchPicker>;

export const ColorPicker: FC<Props> = ({ value, ...reactColorProps }) => {
  return <SketchPicker {...reactColorProps} color={value} />;
};
