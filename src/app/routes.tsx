import * as React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'

import { ConnectedGNB, ConnectedFooter, ConnectedLNB } from 'app/components';
import { ConnectedSplashScreen } from "app/components/SplashScreen";

import history from 'app/config/history';
import {
  ConnectedBookDetail,
  ConnectedCategory,
  ConnectedCharts,
  ConnectedGuide,
  ConnectedHome,
  ConnectedManageSubscription,
  ConnectedMySelect,
  ConnectedMySelectHistory,
  ConnectedOrderHistory,
  ConnectedSearchResult,
  ConnectedSelection,
  ConnectedSetting,
  ConnectedNewReleases,
  ConnectedAvailableBooks,
  ConnectedIntro,
  InAppIntro,
  Error404,
} from 'app/scenes';

import {
  PrivateRoute,
  NonSubscriberOnlyRoute,
  ConnectedScrollManager,
} from 'app/hocs';
import { RidiSelectState } from 'app/store';

export interface Props {
  isRidiApp: boolean;
  isFetching: boolean;
  isSubscribing: boolean;
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

export const Routes: React.SFC<Props> = (props) => (
  <>
    <ConnectedSplashScreen {...props} />
    <ConnectedRouter history={history}>
      <ConnectedScrollManager>
        <Route render={({ location }) => (
          (!props.isRidiApp || inAppGnbRoutes.includes(location.pathname)) && <ConnectedGNB />
        )} />
        <Route render={({ location }) => (
          (LNBRoutes.includes(location.pathname)) && <ConnectedLNB />
        )} />
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
          <PrivateRoute
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
            component={props.isRidiApp ? InAppIntro : ConnectedIntro}
            {...props}
          />
          <Route render={() => <Error404 />} />
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
});
export const ConnectedRoutes = connect(mapStateToProps)(Routes);

export default Routes;
