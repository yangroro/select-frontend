declare const USE_MOCK_RESPONSES: boolean;
declare const DELAY_RESPONSE: number;

export const env = {
  production: process.env.NODE_ENV === 'production',
  development: process.env.NODE_ENV !== 'production',
  useMockResponses: typeof USE_MOCK_RESPONSES !== 'undefined' ? USE_MOCK_RESPONSES : false,
  delayResponse: typeof DELAY_RESPONSE !== 'undefined' ? DELAY_RESPONSE : false,
  API_BASE_URL_STORE: `${window.location.protocol}//${process.env.API_BASE_URL_STORE}`,
};
