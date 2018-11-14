import { Action } from 'app/reducers';
import { GNBSearchActiveType, GNBTransparentType, RGB, FooterTheme } from 'app/services/commonUI';

export const UPDATE_GNB_COLOR = 'UPDATE_GNB_COLOR';
export const UPDATE_SEARCH_ACTIVE_TYPE = 'UPDATE_SEARCH_ACTIVE_TYPE';
export const UPDATE_GNB_TRANSPARENT = 'UPDATE_GNB_TRANSPARENT';
export const UPDATE_FOOTER_THEME = 'UPDATE_FOOTER_THEME';

export interface ActionUpdateGNBColor extends Action<typeof UPDATE_GNB_COLOR, { color: RGB; }> {}
export interface ActionUpdateGNBSearchActiveType extends Action<
    typeof UPDATE_SEARCH_ACTIVE_TYPE, { gnbSearchActiveType: GNBSearchActiveType; }
  > {}
export interface ActionUpdateGNBTransparent extends Action<
    typeof UPDATE_GNB_TRANSPARENT, { transparentType: GNBTransparentType; }
  > {}

export interface ActionUpdateFooterTheme extends Action<
    typeof UPDATE_FOOTER_THEME, { theme: FooterTheme; }
  > {}

export type CommonUIActionTypes =
  ActionUpdateGNBColor |
  ActionUpdateGNBSearchActiveType |
  ActionUpdateGNBTransparent |
  ActionUpdateFooterTheme;

export const updateGNBColor = (color: RGB): ActionUpdateGNBColor => {
  return { type: UPDATE_GNB_COLOR, payload: { color } };
};
export const updateSearchActiveType = (gnbSearchActiveType: GNBSearchActiveType): ActionUpdateGNBSearchActiveType => {
  return { type: UPDATE_SEARCH_ACTIVE_TYPE, payload: { gnbSearchActiveType } };
};
export const updateGNBTransparent = (transparentType: GNBTransparentType): ActionUpdateGNBTransparent => {
  return { type: UPDATE_GNB_TRANSPARENT, payload: { transparentType } };
};
export const updateFooterTheme = (theme: FooterTheme): ActionUpdateFooterTheme => {
  return { type: UPDATE_FOOTER_THEME, payload: { theme } };
};
