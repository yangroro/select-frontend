export interface RidiSelectUserDTO {
  isLoggedIn: boolean;
  uId: string;
  email: string;
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
  isTokenFetched: boolean;
}

export interface PlatformDTO {
  type: string;
  isPc: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isPaper: boolean;
  isPaperPro: boolean;
  isRidiApp: boolean;
}

export interface ConstantsDTO {
  BASE_URL_STORE: string;
  BASE_URL_RIDISELECT: string;
  BASE_URL_RIDI_PAY_API: string;
  BASE_URL_STATIC: string;
  FREE_PROMOTION_MONTHS: number;
  OAUTH2_CLIENT_ID: string;
};

export interface EnvironmentDTO {
  platform: PlatformDTO;
  constants: ConstantsDTO;
}

