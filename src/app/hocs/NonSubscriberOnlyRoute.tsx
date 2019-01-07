import * as React from 'react';
import { connect } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';
import { SplashScreen as CommonLoader } from 'app/components/SplashScreen';
import history from "app/config/history";

export interface NonSubscriberOnlyRouteProps {
  isFetching: boolean;
  isLoggedIn: boolean;
  isSubscribing: boolean;
  component: React.ComponentClass | React.StatelessComponent;
}

export const NonSubscriberOnlyRoute: React.SFC<NonSubscriberOnlyRouteProps> = (props) => {
  const {
    isFetching,
    isSubscribing,
    isLoggedIn,
    component: Component,
    ...restProps
  } = props;

  if (!isFetching && isLoggedIn && isSubscribing) {
    history.replace('/home' + window.location.search);

    return <CommonLoader />;
  }

  return <Component {...restProps} />;
};

const mapStateToProps = (state: RidiSelectState): Omit<NonSubscriberOnlyRouteProps, 'component'> => {
  return {
    isFetching: state.user.isFetching,
    isLoggedIn: state.user.isLoggedIn,
    isSubscribing: state.user.isSubscribing,
  };
};

export const ConnectedNonSubscriberOnlyRoute = connect(mapStateToProps, null, null, {
  pure: false,
})(NonSubscriberOnlyRoute);
