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
    BASE_URL_STORE: '',
    BASE_URL_STATIC: '',
    BASE_URL_RIDISELECT: '',
    BASE_URL_RIDI_PAY_API: '',
    FREE_PROMOTION_MONTHS: 1,
  }
};
