import { createTypes, createReducer, createActions } from 'reduxsauce';

export const isDefaultColor = (color: RGB) => color.r === GNB_DEFAULT_COLOR.r &&
  color.g === GNB_DEFAULT_COLOR.g &&
  color.b === GNB_DEFAULT_COLOR.b;

export const toRGBString = (rgb: RGB): string => `rgb(${rgb.r},${rgb.g},${rgb.b})`;

export const GNB_DEFAULT_COLOR: RGB = {
  r: 23,
  g: 32,
  b: 46,
};
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

export enum GNBColorLevel {
  DARK = 'dark',
  BRIGHT = 'bright',
  TRANSPARENT = 'transparent',
  DEFAULT = 'default'
};

export interface CommonUIState {
  gnbColor: RGB;
  gnbColorLevel: GNBColorLevel;
  gnbSearchActiveType: GNBSearchActiveType;
  gnbTransparentType: GNBTransparentType;
  footerTheme: FooterTheme;
}

const TYPE = createTypes(`
  UPDATE_GNB_COLOR
  UPDATE_SEARCH_ACTIVE_TYPE
  UPDATE_GNB_TRANSPARENT
  UPDATE_FOOTER_THEME
`);

export const INITIAL_STATE: CommonUIState = {
  gnbColor: GNB_DEFAULT_COLOR,
  gnbColorLevel: GNBColorLevel.DEFAULT,
  gnbSearchActiveType: GNBSearchActiveType.cover,
  gnbTransparentType: GNBTransparentType.default,
  footerTheme: FooterTheme.default,
};

export const Reducer = createReducer(INITIAL_STATE, {
  [TYPE.UPDATE_SEARCH_ACTIVE_TYPE]: (state = INITIAL_STATE, action) => ({
    ...state,
    gnbSearchActiveType: action.payload.gnbSearchActiveType,
  }),
  [TYPE.UPDATE_GNB_COLOR]: (state, action) => {
    const { color } = action.payload;
    const redCalc = color.r * 0.299;
    const greenCalc = color.g * 0.587;
    const blueCalc = color.b * 0.114;
    return {
      ...state,
      gnbColor: color,
      gnbColorLevel: isDefaultColor(color)
        ? GNBColorLevel.DEFAULT
        : color.r === GNB_DEFAULT_COLOR.r && redCalc + greenCalc + blueCalc > 186
          ? GNBColorLevel.BRIGHT
          : GNBColorLevel.DARK,
    };
  },
  [TYPE.UPDATE_GNB_TRANSPARENT]: (state, action) => ({
    ...state,
    gnbTransparentType: action.payload.transparentType,
  }),
  [TYPE.UPDATE_FOOTER_THEME]: (state, action) => ({
    ...state,
    footerTheme: action.payload.theme,
  }),
});

export const { Types, Creators } = createActions({
  updateGNBColor: (color: RGB) => ({
    color
  }),
  updateSearchActiveType: (gnbSearchActiveType: GNBSearchActiveType) => ({
    gnbSearchActiveType
  }),
  updateGNBTransparent: (transparentType: GNBTransparentType) => ({
    transparentType
  }),
  updateFooterTheme: (theme: FooterTheme) => ({
    theme
  }),
})
