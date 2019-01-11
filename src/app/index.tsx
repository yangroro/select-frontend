import "@babel/polyfill";

import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import { ConnectedRoutes } from 'app/routes';
import { store } from 'app/store';

import { SplashScreen } from "app/components/SplashScreen";
import { fetchUserInfo } from "app/services/user/helper";

import setTabKeyFocus from 'app/config/setTabKeyFocus';
import { initializeUser, fetchUser } from 'app/services/user';
import { initializeScrollEnd } from 'app/services/tracking/onWindowScrollEnd';
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

class App extends React.Component<{}, { isLoaded: boolean }> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isLoaded: false,
    };
  }

  async componentDidMount() {
    try {
      const user = await fetchUserInfo();
      store.dispatch(initializeUser(user));
    } finally {
      this.setState({
        isLoaded: true,
      });
      store.dispatch(fetchUser({ isFetching: false }));
    }
  }

  render () {
    return (
      <Provider store={store}>
        <>
          <ConnectedRoutes />
          {!this.state.isLoaded && <SplashScreen />}
        </>
      </Provider>
    );
  }
};

render(
  <App />,
  document.getElementById('app'),
);
