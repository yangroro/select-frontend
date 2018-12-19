import { EnvironmentDTO } from '../../../types';

export type EnvironmentState = EnvironmentDTO;;

export const environmentInitialState: EnvironmentState = {
  platform: {
    isRidiApp: false,
  },
  constants: {
    BASE_URL_STORE: '',
    BASE_URL_STATIC: '',
    BASE_URL_RIDISELECT: '',
    BASE_URL_RIDI_PAY_API: '',
    FREE_PROMOTION_MONTHS: 1,
    OAUTH2_CLIENT_ID: '',
  }
};
