'use client';
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import type { CustomColor } from '@/components/ui/type';

export const customStyle = (customColor: CustomColor['customColor']) => css`
  border-color: ${customColor?.borderColor} !important;
  background-color: ${customColor?.contentBackgroundColor} !important;

  &::placeholder {
    color: ${customColor?.textColor} !important;
  }

  &:focus {
    --tw-ring-color: ${customColor?.primaryColor} !important;
  }
`;
