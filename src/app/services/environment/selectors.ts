import { RidiSelectState } from 'app/store';
import { createSelector } from 'reselect';

export const selectIsIos = (state: RidiSelectState): boolean => state.environment.platform.isIos;
export const selectIsAndroid = (state: RidiSelectState): boolean => state.environment.platform.isAndroid;
export const selectIsInApp = (state: RidiSelectState): boolean => state.environment.platform.isRidibooks;
export const selectPathname = (state: RidiSelectState): string => state.router.location!.pathname;

export const getIsIosInApp = createSelector(
  [selectIsIos, selectIsInApp],
  (isIos: boolean, isInApp: boolean): boolean => isIos && isInApp,
);

export const getIsAndroidInApp = createSelector(
  [selectIsAndroid, selectIsInApp],
  (isAndroid: boolean, isInApp: boolean): boolean => isAndroid && isInApp,
);

export const getIsInAppRoot = createSelector(
  [selectIsInApp, selectPathname],
  (isInApp: boolean, pathname: string): boolean => isInApp && (pathname === '/'),
);

export const getIsRoot = createSelector(
  [selectIsInApp, selectPathname],
  (isInApp: boolean, pathname: string): boolean => (pathname === '/'),
);
