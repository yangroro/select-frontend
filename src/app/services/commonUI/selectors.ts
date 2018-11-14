import { RidiSelectState } from "app/store";
import { RGB } from "./reducer.state";
import { createSelector } from "reselect";

export const selectGnbColor = (state: RidiSelectState): RGB => state.commonUI.gnbColor;

export const getSolidBackgroundColorRGBString = createSelector(
  [selectGnbColor],
  (gnbColor: RGB): string => `rgba(${gnbColor.r}, ${gnbColor.g}, ${gnbColor.b}, 1)`,
);

export const getTransparentBackgroundColorRGBString = createSelector(
  [selectGnbColor],
  (gnbColor: RGB): string => `rgba(${gnbColor.r}, ${gnbColor.g}, ${gnbColor.b}, 0.95)`,
);

export const getBackgroundColorGradientToRight = createSelector(
  [selectGnbColor],
  (gnbColor: RGB): string => `linear-gradient(to right,
    rgba(${gnbColor.r},${gnbColor.g},${gnbColor.b},1) 0%,
    rgba(255, 255, 255, 0) 100%`,
);

export const getBackgroundColorGradientToLeft = createSelector(
  [selectGnbColor],
  (gnbColor: RGB): string => `linear-gradient(to left,
    rgba(${gnbColor.r},${gnbColor.g},${gnbColor.b},1) 0%,
    rgba(255, 255, 255, 0) 100%`,
);
