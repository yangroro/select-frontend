
export type EnvironmentState = {
  platform: {
    isRidiApp: boolean;
  };
  constants: {
    BASE_URL_STORE: string;
    BASE_URL_RIDISELECT: string;
    BASE_URL_RIDI_PAY_API: string;
    BASE_URL_STATIC: string;
    FREE_PROMOTION_MONTHS: number;
    OAUTH2_CLIENT_ID: string;
  };
};;

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
