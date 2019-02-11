import request from 'app/config/axios';
import env from 'app/config/env';
import { requestAccountsMe } from 'app/services/user/requests';
import axios, { AxiosError } from 'axios';

interface RidiSelectSubscriptionDTO {
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
  fetchError: AxiosError|null;
}

interface RidiSelectAccountDTO {
  isLoggedIn: boolean;
  uId: string;
  email: string;
}

export interface UserDTO {
  isLoggedIn: boolean;
  uId: string;
  email: string;
  isSubscribing: boolean;
  hasSubscribedBefore: boolean;
}

const NOT_LOGGED_IN_ACCOUNT_INFO: RidiSelectAccountDTO = {
  isLoggedIn: false,
  uId: '',
  email: '',
};

const fetchSubscriptionInfo = async (): Promise<RidiSelectSubscriptionDTO> => {
  return request({
    url: `${env.STORE_API}/api/select/users/me/subscription`,
    withCredentials: true,
  }).then((response) => ({
    isSubscribing: true,
    hasSubscribedBefore: true,
    fetchError: null,
  })).catch((e) => ({
    isSubscribing: false,
    hasSubscribedBefore: (
      (e.response && e.response.status === 402) ? e.response.data.is_previously_subscribed : false
    ),
    fetchError: e,
  }));
};

const fetchAccountInfo = async (): Promise<RidiSelectAccountDTO> => {
  return requestAccountsMe().then((response) => {
    return {
      isLoggedIn: true,
      uId: response.data.result.id,
      email: response.data.result.email,
    };
  }).catch((e) => {
    return NOT_LOGGED_IN_ACCOUNT_INFO;
  });
};

export const fetchUserInfo = async (): Promise<UserDTO> => {
  const fetchedSubscriptionInfo = await fetchSubscriptionInfo();
  const { fetchError, ...subscriptionInfo } = fetchedSubscriptionInfo;

  return {
    ...subscriptionInfo,
    ...subscriptionInfo.isSubscribing ? await fetchAccountInfo() : NOT_LOGGED_IN_ACCOUNT_INFO,
  };
};
