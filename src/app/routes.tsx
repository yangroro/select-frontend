import * as React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import { ConnectedFooter, ConnectedGNB, ConnectedLNB } from 'app/components';
import { ConnectedSplashScreen } from 'app/components/SplashScreen';
import { errorResponseStatus } from 'app/services/serviceStatus';

import history from 'app/config/history';
import {
  ConnectedAvailableBooks,
  ConnectedBookDetail,
  ConnectedCategory,
  ConnectedCharts,
  ConnectedErrorPage,
  ConnectedGuide,
  ConnectedHome,
  ConnectedIntro,
  ConnectedManageSubscription,
  ConnectedMySelect,
  ConnectedMySelectHistory,
  ConnectedNewReleases,
  ConnectedOrderHistory,
  ConnectedSearchResult,
  ConnectedSelection,
  ConnectedSetting,
  InAppIntro,
} from 'app/scenes';

import {
  ConnectedScrollManager,
  NonSubscriberOnlyRoute,
  PrivateRoute,
} from 'app/hocs';
import { RidiSelectState } from 'app/store';

export interface Props {
  isRidiApp: boolean;
  isFetching: boolean;
  isSubscribing: boolean;
  errorResponseState?: errorResponseStatus;
}

export const inAppGnbRoutes = [
  '/home',
  '/new-releases',
  '/categories',
  '/my-select',
  '/search',
  '/',
];

export const LNBRoutes = [
  '/home',
  '/new-releases',
  '/categories',
  '/my-select',
];

export const Routes: React.SFC<Props> = (props) => props.errorResponseState ? (
  <ConnectedErrorPage />
) : (
  <>
    <ConnectedSplashScreen {...props} />
    <ConnectedRouter history={history}>
      <ConnectedScrollManager>
        <Route
          render={({ location }) => (
            (!props.isRidiApp || inAppGnbRoutes.includes(location.pathname)) && <ConnectedGNB />
          )}
        />
        <Route
          render={({ location }) => (
            (LNBRoutes.includes(location.pathname)) && <ConnectedLNB />
          )}
        />
        <Switch>
          <PrivateRoute
            path="/home"
            component={ConnectedHome}
            {...props}
          />
          <PrivateRoute
            path="/new-releases"
            component={ConnectedNewReleases}
            {...props}
          />
          <PrivateRoute
            path="/charts"
            component={ConnectedCharts}
            {...props}
          />
          <PrivateRoute
            path="/selection/:selectionId"
            component={ConnectedSelection}
            {...props}
          />
          <PrivateRoute
            path="/categories"
            component={ConnectedCategory}
            {...props}
          />
          <PrivateRoute
            path="/my-select"
            component={ConnectedMySelect}
            {...props}
          />
          <Route
            path="/book/:bookId"
            component={ConnectedBookDetail}
            {...props}
          />
          <PrivateRoute
            path="/settings"
            component={ConnectedSetting}
            {...props}
          />
          <PrivateRoute
            path="/manage-subscription"
            component={ConnectedManageSubscription}
            {...props}
          />
          <PrivateRoute
            path="/order-history"
            component={ConnectedOrderHistory}
            {...props}
          />
          <PrivateRoute
            path="/my-select-history"
            component={ConnectedMySelectHistory}
            {...props}
          />
          <PrivateRoute
            path="/search"
            component={ConnectedSearchResult}
            {...props}

          />
          <Route path="/guide" render={() => <ConnectedGuide />} />
          <Route path="/books" render={() => <ConnectedAvailableBooks />} />
          <NonSubscriberOnlyRoute
            path="/"
            exact={true}
            component={props.isRidiApp ? InAppIntro : ConnectedIntro}
            {...props}
          />
          <Route render={() => <ConnectedErrorPage />} />
        </Switch>
        {!props.isRidiApp && <ConnectedFooter />}
      </ConnectedScrollManager>
    </ConnectedRouter>
  </>
);

const mapStateToProps = (rootState: RidiSelectState): Props => ({
  isRidiApp: rootState.environment.platform.isRidibooks,
  isFetching: rootState.user.isFetching,
  isSubscribing: rootState.user.isSubscribing,
  errorResponseState: rootState.serviceStatus.errorResponseState,
});
export const ConnectedRoutes = connect(mapStateToProps)(Routes);

export default Routes;
