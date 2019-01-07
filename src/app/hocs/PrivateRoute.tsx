import * as React from 'react';
import { connect } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';
import { SplashScreen as CommonLoader } from 'app/components/SplashScreen';

export interface PrivateRouteProps {
  isFetching: boolean;
  isLoggedIn: boolean;
  isSubscribing: boolean;
  component: React.ComponentClass | React.StatelessComponent;
}

export const PrivateRoute: React.SFC<PrivateRouteProps> = (props) => {
  const {
    isFetching,
    isLoggedIn,
    isSubscribing,
    component: Component,
    ...restProps
  } = props;

  if (!isFetching && (isLoggedIn === false || !isSubscribing)) {
    location.replace('/');
    return <CommonLoader />;
  }

  return <Component {...restProps} />;
};

const mapStateToProps = (state: RidiSelectState): Omit<PrivateRouteProps, 'component'> => {
  return {
    isFetching: state.user.isFetching,
    isLoggedIn: state.user.isLoggedIn,
    isSubscribing: state.user.isSubscribing,
  };
};

export const ConnectedPrivateRoute = connect(mapStateToProps, null, null, {
  pure: false,
})(PrivateRoute);
