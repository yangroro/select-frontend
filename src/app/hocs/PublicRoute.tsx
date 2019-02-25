import * as React from 'react';
import { connect } from 'react-redux';

import { RouteProps } from 'react-router';
import { Route } from 'react-router-dom';

import { Actions as EnvironmentActions } from 'app/services/environment';

export interface PublicRouteProps extends RouteProps {
  isFetching: boolean;
}

const PublicRoute: React.SFC<PublicRouteProps & ReturnType<typeof MapDispatchToProps>> = (props) => {
  const {
    isFetching,
    dispatchCompletePublicRouteLoad,
    ...restProps
  } = props;

  if (isFetching) {
    return null;
  }

  dispatchCompletePublicRouteLoad();

  return <Route {...restProps} />;
};

const MapDispatchToProps = (dispatch: any) => ({
  dispatchCompletePublicRouteLoad: () => dispatch(EnvironmentActions.completePublicRouteLoad()),
});

export const ConnectedPublicRoute = connect(null, MapDispatchToProps)(PublicRoute);
