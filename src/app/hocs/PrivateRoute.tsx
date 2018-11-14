import * as React from 'react';
import { connect } from 'react-redux';

import { RidiSelectState } from 'app/store';
import { Omit } from 'app/types';
import { CommonLoader } from 'app/components/CommonLoader';

export interface PrivateRouteProps {
  isLoggedIn: boolean;
  isSubscribing: boolean;
  component: React.ComponentClass | React.StatelessComponent;
}

export const PrivateRoute: React.SFC<PrivateRouteProps> = (props) => {
  const {
    isLoggedIn,
    isSubscribing,
    component: Component,
    ...restProps
  } = props;

  if (!isLoggedIn || !isSubscribing) {
    location.replace('/');
    return <CommonLoader />;
  }

  return <Component {...restProps} />;
};

const mapStateToProps = (state: RidiSelectState): Omit<PrivateRouteProps, 'component'> => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    isSubscribing: state.user.isSubscribing,
  };
};

export const ConnectedPrivateRoute = connect(mapStateToProps, null, null, {
  pure: false,
})(PrivateRoute);
