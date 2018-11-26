import * as React from 'react';
import { render } from 'react-dom';

import { store } from 'app/store';
import App from 'app/App';
import setTabKeyFocus from 'app/config/setTabKeyFocus';
import { EnvironmentState, initializeEnvironmentData } from 'app/services/environment';
import { initializeUser } from 'app/services/user';
import { RidiSelectLoadEvent, RidiSelectUserDTO } from '../types';
import { initializeScrollEnd } from 'app/services/tracking/onWindowScrollEnd';
import { fetchRidiSelectUserInfo } from "app/services/user/helper";
import { controlAndroidAppNativeHorizontalScroll } from 'app/utils/handleNativeHorizontalScroll';

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

  render(
    <App store={store} />,
    document.getElementById(targetElementId),
  );
}

window.addEventListener('ridiSelectLoad', (event: RidiSelectLoadEvent) => {
  const environment = event.detail.dto.environment;
  const targetElementId = event.detail.targetElementId;

  fetchRidiSelectUserInfo(environment).then(ridiSelectUser => {
    launchApp(targetElementId, ridiSelectUser, environment)
  });
});

