import * as React from 'react';
import { render } from 'react-dom';

import { store } from 'app/store';
import App from 'app/App';
import setTabKeyFocus from 'app/config/setTabKeyFocus';
import { EnvironmentState, initializeEnvironmentData } from 'app/services/environment';
import { initializeUser } from 'app/services/user';
import { RidiSelectUserDTO, EnvironmentDTO } from '../types';
import { initializeScrollEnd } from 'app/services/tracking/onWindowScrollEnd';
import { fetchRidiSelectUserInfo } from "app/services/user/helper";
import { controlAndroidAppNativeHorizontalScroll } from 'app/utils/handleNativeHorizontalScroll';
import { getPlatformDetail } from './utils/downloadUserBook';

// Show browser input focused outline when tab key is pressed
setTabKeyFocus();

// initialize ScrollEnd Event listener for imperssion tracking
initializeScrollEnd();

// Set horizontal scroll handler
controlAndroidAppNativeHorizontalScroll([
  'InlineHorizontalBookList',
  'BigBanner',
  'HomeSection-horizontal-pad',
]);

const launchApp = (targetElementId: string, ridiSelectUser: RidiSelectUserDTO, environment: EnvironmentState) => {
  // Initialize User State
  store.dispatch(initializeUser(ridiSelectUser));
  store.dispatch(initializeEnvironmentData(environment));

  if (environment.platform.isRidiApp) {
    document.body.classList.add('androidApp');
  }

  render(
    <App store={store} />,
    document.getElementById(targetElementId),
  );
}

window.addEventListener('ridiSelectLoad', () => {
  const BASE_URL_STORE = process.env.BASE_URL_STORE || '';
  const BASE_URL_RIDISELECT = process.env.BASE_URL_RIDISELECT || '';
  const BASE_URL_STATIC = process.env.BASE_URL_STATIC || '';
  const BASE_URL_RIDI_PAY_API = process.env.BASE_URL_RIDI_PAY_API || '';
  const OAUTH2_CLIENT_ID = process.env.OAUTH2_CLIENT_ID || '';

  const constants = {
    BASE_URL_STORE,
    BASE_URL_RIDISELECT,
    BASE_URL_STATIC,
    BASE_URL_RIDI_PAY_API,
    FREE_PROMOTION_MONTHS: 1,
    OAUTH2_CLIENT_ID,
  };

  const environment: EnvironmentDTO = {
    platform: {
      isRidiApp: getPlatformDetail().isRidiApp,
    },
    constants,
  };
  const targetElementId = 'app';
  fetchRidiSelectUserInfo(environment).then(ridiSelectUser => {
    launchApp(targetElementId, ridiSelectUser, environment)
  });
});

