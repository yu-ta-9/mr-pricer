'use client';
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import type { CustomColor } from '@/components/ui/type';

export const customStyle = (customColor: CustomColor['customColor']) => css`
  color: ${customColor?.textColor} !important;
  --tw-ring-color: ${customColor?.primaryColor} !important;
  border-color: ${customColor?.borderColor} !important;
  background-color: ${customColor?.borderColor} !important;
`;
