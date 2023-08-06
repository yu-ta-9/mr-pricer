import { COLOR_PALETTE } from '@/utils/styles/palette';

import type { CustomColor } from '@/components/ui/type';

export const customStyles = (isError: boolean, customColor: CustomColor['customColor']) => ({
  container: (provided: Record<string, unknown>) => ({
    ...provided,
    display: 'flex',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    background: customColor?.contentBackgroundColor || COLOR_PALETTE.white,
    borderRadius: '0.375rem',
  }),
  placeholder: (defaultStyle: Record<string, unknown>) => {
    return {
      ...defaultStyle,
      color: customColor?.textColor || COLOR_PALETTE.basePrimary,
    };
  },
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided: Record<string, unknown>) => ({
    ...provided,
    color: COLOR_PALETTE.basePrimary,
    padding: '0.5rem',
  }),
  valueContainer: (provided: Record<string, unknown>) => ({
    ...provided,
    padding: '0',
  }),
  control: (_provided: Record<string, unknown>, state: { isFocused: boolean }) => {
    const borderColor = isError
      ? COLOR_PALETTE.error
      : state.isFocused
      ? COLOR_PALETTE.primary
      : COLOR_PALETTE.basePrimary;

    return {
      display: 'flex',
      border: `solid 1px ${customColor?.borderColor || borderColor}`,
      borderColor: state.isFocused
        ? customColor?.primaryColor || COLOR_PALETTE.primary
        : customColor?.borderColor || borderColor,
      borderRadius: '0.375rem',
      width: '100%',
      padding: '0 0 0 0.75rem',
      outline: 'none',
      '--tw-ring-color': customColor?.primaryColor,
      boxShadow: state.isFocused
        ? 'var(--tw-ring-inset) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color)'
        : 'none',
    };
  },
  option: (provided: Record<string, unknown>, state: { isSelected: boolean }) => {
    const fontWeight = state.isSelected ? '700' : '400';

    return {
      ...provided,
      fontWeight,
      backgroundColor: COLOR_PALETTE.white,
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: customColor?.primaryColor || COLOR_PALETTE.primary,
      },
    };
  },
  multiValue: (provided: Record<string, unknown>) => ({
    ...provided,
    backgroundColor: customColor?.borderColor || COLOR_PALETTE.basePrimary,
  }),
});
