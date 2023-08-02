/**
 * TODO: 色コードを定数化する
 */
export const customStyles = (isError: boolean) => ({
  container: (provided: Record<string, unknown>) => ({
    ...provided,
    display: 'flex',
    fontSize: '0.875rem',
    lineHeight: '1.25rem',
    background: '#fff',
    borderRadius: '0.375rem',
  }),
  placeholder: (defaultStyle: Record<string, unknown>) => {
    return {
      ...defaultStyle,
      color: '#898C96',
    };
  },
  indicatorSeparator: () => ({
    display: 'none',
  }),
  dropdownIndicator: (provided: Record<string, unknown>) => ({
    ...provided,
    color: '#898C96',
    padding: '0.5rem',
  }),
  valueContainer: (provided: Record<string, unknown>) => ({
    ...provided,
    padding: '0',
  }),
  control: (_provided: Record<string, unknown>, state: { isFocused: boolean }) => {
    const borderColor = isError ? '#FF4747' : state.isFocused ? '#A7CCFC' : '#898C96';

    return {
      display: 'flex',
      border: `solid 1px ${borderColor}`,
      borderRadius: '0.375rem',
      width: '100%',
      padding: '0 0 0 0.75rem',
      outline: 'none',
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
      backgroundColor: '#fff',
      color: '#000',
      fontSize: '0.875rem',
      lineHeight: '1.25rem',
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: '#A7CCFC',
      },
    };
  },
});
