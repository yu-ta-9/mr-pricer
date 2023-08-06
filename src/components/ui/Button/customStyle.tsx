'use client';
/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';

import type { CustomColor } from '@/components/ui/type';

export const customStyle = (customColor: CustomColor['customColor']) => css`
  background-color: ${customColor?.primaryColor} !important;
  color: ${customColor?.textColor} !important;

  &:hover {
    // TODO: tailwindの指定に沿うようすれば不要になるのでhex → rgbに変換するライブラリを導入してそうしたい
    opacity: 0.5;
  }

  &:disabled {
    // TODO: tailwindの指定に沿うようすれば不要になるのでhex → rgbに変換するライブラリを導入してそうしたい
    opacity: 0.5;
  }
`;
