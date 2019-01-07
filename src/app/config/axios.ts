import axios, { AxiosError, AxiosPromise, AxiosRequestConfig, AxiosResponse } from 'axios';
import axiosRetry from 'axios-retry';

import env from 'app/config/env';

const instance = axios.create({
  baseURL: env.SELECT_API,
  timeout: env.production ? 3500: 60000,
  withCredentials: true,
});

axiosRetry(instance, {
  retries: 2,
  retryDelay: (retryNumber = 0) => 200 * (2 ** retryNumber),
});

instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      if (error.response.config.url !== `${env.ACCOUNT_API}/ridi/token/`) {
        return instance
          .post(`${env.ACCOUNT_API}/ridi/token/`)
          .then(() => axios(error.response.config))
          .catch(e => Promise.reject(e));
      }
      return axios
        .get(`${env.ACCOUNT_API}/ridi/authorize/`, {
          withCredentials: true,
          params: {
            client_id: env.OAUTH2_CLIENT_ID || 'ePgbKKRyPvdAFzTvFg2DvrS7GenfstHdkQ2uvFNd',
            response_type: 'code',
            redirect_uri: `${env.ACCOUNT_API}/ridi/complete`,
          },
        })
        .then(() => instance(error.response.config));
    }
    return Promise.reject(error);
  }
);

export default instance;
