import * as React from 'react';
import { connect } from 'react-redux';
import { Switch } from 'react-router';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router'

import { ConnectedGNB, ConnectedFooter, ConnectedLNB } from 'app/components';

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
  ConnectedInAppIntro,
  Error404,
} from 'app/scenes';

import {
  ConnectedNonSubscriberOnlyRoute,
  ConnectedPrivateRoute,
  ConnectedScrollManager,
} from 'app/hocs';
import { RidiSelectState } from 'app/store';

interface Props {
  isRidiApp: boolean;
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

export const Routes: React.SFC<Props> = (props) => {
  return (
    <ConnectedRouter history={history}>
      <ConnectedScrollManager>
        <Route render={({ location }) => (
          (!props.isRidiApp || inAppGnbRoutes.includes(location.pathname)) && <ConnectedGNB />
        )} />
        <Route render={({ location }) => (
          (LNBRoutes.includes(location.pathname)) && <ConnectedLNB />
        )} />
        <Switch>
          <Route
            path="/home"
            render={() => <ConnectedPrivateRoute component={ConnectedHome} />} />
          <Route
            path="/new-releases"
            render={() => <ConnectedPrivateRoute component={ConnectedNewReleases} />}
          />
          <Route
            path="/charts"
            render={() => <ConnectedPrivateRoute component={ConnectedCharts} />}
          />
          <Route
            path="/selection/:selectionId"
            render={() => <ConnectedPrivateRoute component={ConnectedSelection} />}
          />
          <Route
            path="/categories"
            render={() => <ConnectedPrivateRoute component={ConnectedCategory} />}
          />
          <Route
            path="/my-select"
            render={() => <ConnectedPrivateRoute component={ConnectedMySelect} />}
          />
          <Route
            path="/book/:bookId"
            render={() => <ConnectedBookDetail />}
          />
          <Route
            path="/settings"
            render={() => <ConnectedPrivateRoute component={ConnectedSetting} />}
          />
          <Route
            path="/manage-subscription"
            render={() => <ConnectedPrivateRoute component={ConnectedManageSubscription} />}
          />
          <Route
            path="/order-history"
            render={() => <ConnectedPrivateRoute component={ConnectedOrderHistory} />}
          />
          <Route
            path="/my-select-history"
            render={() => <ConnectedPrivateRoute component={ConnectedMySelectHistory} />}
          />
          <Route
            path="/search"
            render={() => <ConnectedPrivateRoute component={ConnectedSearchResult} />}
          />
          <Route path="/guide" render={() => <ConnectedGuide />} />
          <Route path="/books" render={() => <ConnectedAvailableBooks />} />
          <Route
            path="/"
            render={() => <ConnectedNonSubscriberOnlyRoute component={props.isRidiApp ? ConnectedInAppIntro : ConnectedIntro} />}
          />
          <Route render={() => <Error404 />} />
        </Switch>
        {!props.isRidiApp && <ConnectedFooter />}
      </ConnectedScrollManager>
    </ConnectedRouter>
  );
};

const mapStateToProps = (rootState: RidiSelectState) => ({
  isRidiApp: rootState.environment.platform.isRidiApp,
});
export const ConnectedRoutes = connect(mapStateToProps)(Routes);

export default Routes;
