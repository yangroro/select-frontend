/** src/css/base/toast.css */

import toast from 'app/utils/toast';
import { env } from "app/config/env";

export default function showMessageForRequestError(e: any) {
  // 기본적으로 request()에서 401 핸들링(token refresh)을 한 이후에도 401 응답이 발생한 경우 인증이 불가한 상황으로 판단
  if (e.response && e.response.status === 401) {
    toast.fail('재로그인이 필요합니다.', {
      link: {
        url: `${env.STORE_BASE_URL}/account/oauth-authorize`,
        label: '로그인',
        showArrowIcon: true,
      },
      durationMs: 5000,
    });
  } else {
    toast.defaultErrorMessage();
  }
};
