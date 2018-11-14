import { EnvironmentDTO } from '../../../types';

export type EnvironmentState = EnvironmentDTO;;

export const environmentInitialState: EnvironmentState = {
  platform: {
    type: 'unknown',
    isPc: false,
    isTablet: false,
    isMobile: false,
    isPaper: false,
    isPaperPro: false,
    isRidiApp: false,
  },
  constants: {
    STORE_URL: '',
    STATIC_URL: '',
    RIDISELECT_URL: '',
    RIDI_PAY_URL: '',
    FREE_PROMOTION_MONTHS: 1,
  }
};
