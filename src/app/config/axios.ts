import { store } from 'app/store';
import axios, { AxiosError } from 'axios';
import axiosRetry from 'axios-retry';

import env from 'app/config/env';
import { Actions as ServiceStatusActions } from 'app/services/serviceStatus';

const instance = axios.create({
  baseURL: env.SELECT_API,
  timeout: env.production ? 3500 : 60000,
  withCredentials: true,
});

axiosRetry(instance, {
  retries: 3,
  retryDelay: (retryNumber = 0) => 200 * (2 ** retryNumber),
});

instance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      const { status, data, config } = error.response;
      if (status === 401) {
        if (config.url !== `${env.ACCOUNT_API}/ridi/token/`) {
          return instance
            .post(`${env.ACCOUNT_API}/ridi/token/`)
            .then(() => instance(config))
            .catch((e) => Promise.reject(e));
        }
        return axios
          .get(`${env.ACCOUNT_API}/ridi/authorize/`, {
            withCredentials: true,
            params: {
              client_id: env.OAUTH2_CLIENT_ID,
              response_type: 'code',
              redirect_uri: `${env.ACCOUNT_API}/ridi/complete`,
            },
          })
          .then(() => instance(config));
      } else if (Math.floor(status / 100) === 5) {
        store.dispatch(ServiceStatusActions.setState({
          status,
          data,
        }));
      }
    }
    return Promise.reject(error);
  },
);

export default instance;
