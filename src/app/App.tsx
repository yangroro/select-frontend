import * as React from 'react';
import { Provider, Store } from 'react-redux';

import { ConnectedRoutes } from 'app/routes';

export const App: React.SFC<{ store: Store<{}>}> = ({ store }) => (
  <Provider store={store}>
    <ConnectedRoutes />
  </Provider>
);

export default App;
