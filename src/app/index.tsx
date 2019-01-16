import "@babel/polyfill";

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { ConnectedRoutes } from 'app/routes';
import { store } from 'app/store';

import { fetchUserInfo } from "app/services/user/helper";

import setTabKeyFocus from 'app/config/setTabKeyFocus';
import { Actions } from 'app/services/user';
import { initializeScrollEnd } from 'app/utils/onWindowScrollEnd';
import { controlAndroidAppNativeHorizontalScroll } from 'app/utils/handleNativeHorizontalScroll';

// Show browser input focused outline when tab key is pressed
// setTabKeyFocus();

// initialize ScrollEnd Event listener for imperssion tracking
// initializeScrollEnd();

// Set horizontal scroll handler
// controlAndroidAppNativeHorizontalScroll([
//   'InlineHorizontalBookList',
//   'BigBanner',
//   'HomeSection-horizontal-pad',
// ]);

class App extends React.Component<{}, {}> {
  async componentDidMount() {
    try {
      const user = await fetchUserInfo();
      store.dispatch(Actions.initializeUser({ userDTO: user }));
    } finally {
      store.dispatch(Actions.fetchUserInfo({ isFetching: false }));
    }
  }

  render () {
    return (
      <Provider store={store}>
        <ConnectedRoutes />
      </Provider>
    );
  }
};

render(
  <App />,
  document.getElementById('app'),
);
