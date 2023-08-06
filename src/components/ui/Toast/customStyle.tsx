'use client';
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import type { CustomColor } from '@/components/ui/type';

export const customStyle = (customColor: CustomColor['customColor']) => css`
  background-color: ${customColor?.primaryColor} !important;
`;
