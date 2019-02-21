import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import env from 'app/config/env';

let refreshTokenInstance: AxiosInstance;
let refreshTokenRequestCount = 0;
let lastRequestTime: number;

const MAX_REQUEST_COUNT = 3;
const MIN_REQUEST_DURATION = 1000;

export default function(defaultConfig: AxiosRequestConfig) {
  if (refreshTokenInstance) {
    return refreshTokenInstance;
  }

  refreshTokenInstance = axios.create(defaultConfig);

  refreshTokenInstance.interceptors.request.use(
    (config) => {
      if (refreshTokenRequestCount > MAX_REQUEST_COUNT) {
        return Promise.reject();
      }

      if (lastRequestTime - Date.now() < MIN_REQUEST_DURATION) {
        refreshTokenRequestCount += 1;
      } else {
        refreshTokenRequestCount = 1;
      }

      lastRequestTime = Date.now();
      return config;
    },
  );

  refreshTokenInstance.interceptors.response.use(
    undefined,
    (error: AxiosError) => {
      if (error.response) {
        const { status, config } = error.response;
        if (status === 401) {
          return axios
            .get(`${env.ACCOUNT_API}/ridi/authorize/`, {
              withCredentials: true,
              params: {
                client_id: env.OAUTH2_CLIENT_ID,
                response_type: 'code',
                redirect_uri: `${env.ACCOUNT_API}/ridi/complete`,
              },
            })
            .then(() => refreshTokenInstance.request(config));
        }
      }
      return Promise.reject(error);
    },
  );

  return refreshTokenInstance;
}
