import { EnvironmentState } from './../environment/reducer.state';
import { requestAccountsMe } from "app/services/user/requests";
import { RidiSelectUserDTO } from "../../../types";
import { env } from "app/config/env";
import request from "app/utils/request";
import axios, { AxiosError } from "axios";

interface RidiSelectSubscriptionDTO {
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
  fetchError: AxiosError|null;
  isTokenFetched: boolean;
}

interface RidiSelectAccountDTO {
  isLoggedIn: boolean;
  uId: string;
  email: string;
}

const NOT_LOGGED_IN_ACCOUNT_INFO: RidiSelectAccountDTO = {
  isLoggedIn: false,
  uId: '',
  email: ''
};

const getTokenWithSessId = (environment: EnvironmentState): Promise<RidiSelectSubscriptionDTO> => {
  const { constants } = environment;
  const ACCOUNT_BASE_URL = process.env.ACCOUNT_BASE_URL || 'https://account.ridibooks.com';
  return axios.get(
    `${ACCOUNT_BASE_URL}/ridi/authorize/`,
    {
      params: {
        client_id: constants.OAUTH2_CLIENT_ID,
        response_type: 'code',
        redirect_uri: `${ACCOUNT_BASE_URL}/ridi/complete`,
      },
      withCredentials: true,
    }
  ).then(() => {
    location.reload();
    return {
      isSubscribing: false,
      hasSubscribedBefore: false,
      fetchError: null,
      isTokenFetched: false,
    };
  }).catch((e: AxiosError) => {
    return {
      isSubscribing: false,
      hasSubscribedBefore: ((e.response && e.response.status === 402) ? e.response.data.is_previously_subscribed : false),
      fetchError: e,
      isTokenFetched: true,
    };
  });
}

const fetchSubscriptionInfo = async (environment: EnvironmentState): Promise<RidiSelectSubscriptionDTO> => {
  return request({
    url: `${env.BASE_URL_STORE_API}/api/select/users/me/subscription`,
    withCredentials: true
  }).then(response => ({
    isSubscribing: true,
    hasSubscribedBefore: true,
    fetchError: null,
    isTokenFetched: true,
  })).catch(e => {
    const { platform } = environment;
    if (platform.isRidiApp && e.response && e.response.status === 401) {
      return getTokenWithSessId(environment);
    } else {
      return {
        isSubscribing: false,
        hasSubscribedBefore: (
          (e.response && e.response.status === 402) ? e.response.data.is_previously_subscribed : false
        ),
        fetchError: e,
        isTokenFetched: true,
      };
    }
  })
}

const fetchAccountInfo = async (): Promise<RidiSelectAccountDTO> => {
  return requestAccountsMe().then(response => {
    return {
      isLoggedIn: true,
      uId: response.data.result.id,
      email: response.data.result.email
    };
  }).catch(e => {
    return NOT_LOGGED_IN_ACCOUNT_INFO;
  });
}

export const fetchRidiSelectUserInfo = async (environment: EnvironmentState): Promise<RidiSelectUserDTO> => {
  const fetchedSubscriptionInfo = await fetchSubscriptionInfo(environment);
  const { fetchError, ...subscriptionInfo } = fetchedSubscriptionInfo;

  // 401 응답이 아닌 경우에만 계정 정보 fetch
  return (fetchError === null || (fetchError.response && fetchError.response.status !== 401)) ? {
    ...subscriptionInfo,
    ...await fetchAccountInfo()
  } : {
    ...subscriptionInfo,
    ...NOT_LOGGED_IN_ACCOUNT_INFO
  }
}
