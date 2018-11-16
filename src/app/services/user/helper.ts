import { requestAccountsMe } from "app/services/user/requests";
import { RidiSelectUserDTO } from "../../../types";
import { env } from "app/config/env";
import request from "app/utils/request";
import { AxiosError } from "axios";

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

const NOT_LOGGED_IN_ACCOUNT_INFO: RidiSelectAccountDTO = {
  isLoggedIn: false,
  uId: '',
  email: ''
};

const fetchSubscriptionInfo = async (): Promise<RidiSelectSubscriptionDTO> => {
  return request({
    url: `${env.API_BASE_URL_STORE}/api/select/users/me/subscription`,
    withCredentials: true
  }).then(response => ({
    isSubscribing: true,
    hasSubscribedBefore: true,
    fetchError: null,
  })).catch(e => ({
    isSubscribing: false,
    hasSubscribedBefore: ((e.response && e.response.status === 402) ? e.response.data.is_previously_subscribed : false),
    fetchError: e,
  }));
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

export const fetchRidiSelectUserInfo = async (): Promise<RidiSelectUserDTO> => {
  const fetchedSubscriptionInfo = await fetchSubscriptionInfo();
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
