export interface RidiSelectUserDTO {
  isLoggedIn: boolean;
  uId: string;
  email: string;
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
  isTokenFetched: boolean;
}

export type PlatformType = 'mobile' | 'pc' | 'tablet' | 'paper' | 'ridi_app' | 'unknown';

export interface PlatformDTO {
  type: PlatformType;
  isPc: boolean;
  isTablet: boolean;
  isMobile: boolean;
  isPaper: boolean;
  isPaperPro: boolean;
  isRidiApp: boolean;
}

export interface ConstantsDTO {
  STORE_URL: string;
  RIDISELECT_URL: string;
  RIDI_PAY_URL: string;
  STATIC_URL: string;
  FREE_PROMOTION_MONTHS: number;
  OAUTH2_CLIENT_ID: string;
};

export interface EnvironmentDTO {
  platform: PlatformDTO;
  constants: ConstantsDTO;
}

export type RidiSelectLoadEvent = CustomEvent<{
  targetElementId: string;
  dto: {
    environment: EnvironmentDTO;
  };
}>;
