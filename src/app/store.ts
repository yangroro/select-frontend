import { connectRouter } from 'connected-react-router'
import { Dispatch } from 'redux';
import { createLogger } from 'redux-logger';
import { loggers } from 'redux-act';
import { routerMiddleware, RouterState } from 'connected-react-router';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import * as qs from 'qs';
import { History } from 'history';

import history from 'app/config/history';
import { BookState } from 'app/services/book';
import { bookReducer } from 'app/services/book/reducer';
import { bookRootSaga } from 'app/services/book/sagas';
import { CommonUIState, commonUIReducer } from 'app/services/commonUI';
import { HomeState } from 'app/services/home';
import { homeReducer } from 'app/services/home/reducer';
import { homeRootSaga } from 'app/services/home/sagas';
import { userRootSaga } from 'app/services/user/sagas';

import { CategoryBooksState, CategoryListState, categoryBooksReducer, categoryListReducer } from 'app/services/category';
import { categoryRootSaga } from 'app/services/category/sagas';
import { MySelectState } from 'app/services/mySelect';
import { mySelectReducer } from 'app/services/mySelect/reducer';
import { mySelectRootSaga } from 'app/services/mySelect/sagas';
import { INITIAL_STATE as environmentState, environmentReducer } from 'app/services/environment';
import { reviewsReducer, ReviewsState } from 'app/services/review';
import { reviewRootSaga } from 'app/services/review/sagas';
import { SearchResultState } from 'app/services/searchResult';
import { searchResultReducer } from 'app/services/searchResult';
import { searchResultRootSaga } from 'app/services/searchResult/sagas';
import { SelectionsState } from 'app/services/selection';
import { selectionReducer } from 'app/services/selection/reducer';
import { selectionsRootSaga } from 'app/services/selection/sagas';
import { trackingSaga } from 'app/services/tracking/sagas';

import { userReducer, UserState } from 'app/services/user';
import env from 'app/config/env';
import { downloadSaga } from 'app/services/download/sagas';
import { stateHydrator } from 'app/utils/stateHydrator';
import { CustomHistoryState, customHistoryReducer, customHistorySaga } from 'app/services/customHistory';
import { INITIAL_STATE as TrackingState, trackingReducer } from 'app/services/tracking';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: any;
  }
}

function* rootSaga(dispatch: Dispatch) {
  yield all([
    homeRootSaga(),
    bookRootSaga(),
    reviewRootSaga(dispatch),
    userRootSaga(),
    selectionsRootSaga(),
    categoryRootSaga(),
    searchResultRootSaga(),
    mySelectRootSaga(),
    trackingSaga(),
    downloadSaga(),
    customHistorySaga(),
  ]);
}

export interface RidiSelectState {
  router: RouterState;
  user: UserState;
  home: HomeState;
  booksById: BookState;
  selectionsById: SelectionsState;
  commonUI: CommonUIState;
  reviewsByBookId: ReviewsState;
  categories: CategoryListState;
  categoriesById: CategoryBooksState;
  searchResult: SearchResultState;
  mySelect: MySelectState;
  tracking: typeof TrackingState;
  environment: typeof environmentState;
  customHistory: CustomHistoryState;
}

const composeEnhancers = !env.production
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  : compose;
const sagaMiddleware = createSagaMiddleware();
const logger = createLogger({
  ...loggers.reduxLogger,
});

export const hasRefreshedForAppDownload = () => !!qs.parse(location.search, { ignoreQueryPrefix: true })['to_app_store']
export const hasCompletedSubscription = () => !!qs.parse(location.search, { ignoreQueryPrefix: true })['new_subscription']

const reducers = ((history: History) => combineReducers({
  router: connectRouter(history),
  user: userReducer,
  home: homeReducer,
  booksById: bookReducer,
  selectionsById: selectionReducer,
  commonUI: commonUIReducer,
  reviewsByBookId: reviewsReducer,
  categories: categoryListReducer,
  categoriesById: categoryBooksReducer,
  searchResult: searchResultReducer,
  mySelect: mySelectReducer,
  tracking: trackingReducer,
  environment: environmentReducer,
  customHistory: customHistoryReducer
}))(history);

const enhancers = composeEnhancers(
  applyMiddleware(
    routerMiddleware(history),
    sagaMiddleware,
    logger,
  ),
);

const savedState = stateHydrator.load();
export const store = hasRefreshedForAppDownload() && savedState
  ? createStore(reducers, savedState, enhancers)
  : createStore(reducers, enhancers);

sagaMiddleware.run(rootSaga, store.dispatch);
