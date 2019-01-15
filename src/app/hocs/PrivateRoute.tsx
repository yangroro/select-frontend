import * as React from 'react';
import { RouteProps } from 'react-router';
import { Route } from 'react-router-dom';

import history from "app/config/history";

export interface PrivateRouteProps extends RouteProps {
  isFetching: boolean;
  isSubscribing: boolean;
}

export const PrivateRoute: React.SFC<PrivateRouteProps> = (props) => {
  const {
    isFetching,
    isSubscribing,
    ...restProps
  } = props;

  if (isFetching) {
    return null;
  }

  if (!isSubscribing) {
    history.replace('/' + window.location.search);
  }

  return <Route {...restProps} />;
};
