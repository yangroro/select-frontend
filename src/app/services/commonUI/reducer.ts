import {
  commonUIInitialState,
  CommonUIState,
  GNB_DEFAULT_COLOR,
  isDefaultColor,
} from 'app/services/commonUI';
import {
  CommonUIActionTypes,
  UPDATE_GNB_COLOR,
  UPDATE_SEARCH_ACTIVE_TYPE,
  UPDATE_GNB_TRANSPARENT,
  UPDATE_FOOTER_THEME,
} from 'app/services/commonUI/actions';

export const commonUIReducer = (
  state = commonUIInitialState,
  action: CommonUIActionTypes,
): CommonUIState => {
  switch (action.type) {
    case UPDATE_SEARCH_ACTIVE_TYPE:
      const { gnbSearchActiveType } = action.payload!;
      return {
        ...state,
        gnbSearchActiveType,
      };
    case UPDATE_GNB_COLOR:
      const { color } = action.payload!;
      const redCalc = color.r * 0.299;
      const greenCalc = color.g * 0.587;
      const blueCalc = color.b * 0.114;
      return {
        ...state,
        gnbColor: color,
        gnbColorLevel: isDefaultColor(color)
          ? 'default'
          : color.r === GNB_DEFAULT_COLOR.r && redCalc + greenCalc + blueCalc > 186
            ? 'bright'
            : 'dark',
      };
    case UPDATE_GNB_TRANSPARENT:
      const { transparentType } = action.payload!;
      return {
        ...state,
        gnbTransparentType: transparentType,
      };
    case UPDATE_FOOTER_THEME:
      const { theme } = action.payload!;
      return {
        ...state,
        footerTheme: theme,
      };
    default:
      return state;
  }
};
