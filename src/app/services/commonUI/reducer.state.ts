export const GNB_DEFAULT_COLOR: RGB = {
  r: 23,
  g: 32,
  b: 46,
};

export const isDefaultColor = (color: RGB) => color.r === GNB_DEFAULT_COLOR.r &&
  color.g === GNB_DEFAULT_COLOR.g &&
  color.b === GNB_DEFAULT_COLOR.b;

export const toRGBString = (rgb: RGB): string => `rgb(${rgb.r},${rgb.g},${rgb.b})`;

export interface RGB {
  r: number;
  g: number;
  b: number;
}

export enum GNBSearchActiveType {
  cover,
  block,
}

export enum GNBTransparentType {
  transparent,
  default,
}

export enum FooterTheme {
  default,
  dark,
}

export type GNBColorLevel = 'dark' | 'bright' | 'transparent' | 'default';

export interface CommonUIState {
  gnbColor: RGB;
  gnbColorLevel: GNBColorLevel;
  gnbSearchActiveType: GNBSearchActiveType;
  gnbTransparentType: GNBTransparentType;
  footerTheme: FooterTheme;
}

export const commonUIInitialState: CommonUIState = {
  gnbColor: GNB_DEFAULT_COLOR,
  gnbColorLevel: 'default',
  gnbSearchActiveType: GNBSearchActiveType.cover,
  gnbTransparentType: GNBTransparentType.default,
  footerTheme: FooterTheme.default,
};
