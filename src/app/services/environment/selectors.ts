import { RidiSelectState } from 'app/store';
import { createSelector } from 'reselect';

export const selectIsIos = (state: RidiSelectState): boolean => state.environment.platform.isIos;
export const selectIsInApp = (state: RidiSelectState): boolean => state.environment.platform.isRidibooks;

export const getIsIosInApp = createSelector(
  [selectIsIos, selectIsInApp],
  (isIos: boolean, isInApp: boolean): boolean => isIos && isInApp,
);
