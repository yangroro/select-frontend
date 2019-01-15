import { RidiSelectState } from 'app/store';
import { LOCATION_CHANGE, go } from 'connected-react-router';
import { all, select, take, put, call } from 'redux-saga/effects';
import { findUpperPathDiff, historyStackSessionStorageHelper } from './historyStack.helpers';
import { Actions } from 'app/services/customHistory';

export function* watchLocationChange() {
  while (true) {
    yield take(LOCATION_CHANGE);
    const state: RidiSelectState = yield select((s) => s);
    if (state.customHistory.historyStack.length === 0 && window.history.length > 0) {
      yield put(Actions.syncHistoryStack({
        location: state.router.location!,
        stack: historyStackSessionStorageHelper.getStack()
      }));
    } else {
      yield put(Actions.syncHistoryStack({
        location: state.router.location!
      }));
    }
  }
}

export function* watchSyncHistoryStack() {
  while (true) {
    yield take(Actions.syncHistoryStack.getType());
    const state: RidiSelectState = yield select((s) => s);
    yield call(historyStackSessionStorageHelper.saveStack, state.customHistory.historyStack);
  }
}

export function* watchNavigateUp(){
  while (true) {
    yield take(Actions.navigateUp.getType());
    const state: RidiSelectState = yield select((s) => s);
    yield put(go(findUpperPathDiff(state.customHistory.historyStack)));
  }
}

export function* customHistorySaga() {
  yield all([
    watchLocationChange(),
    watchSyncHistoryStack(),
    watchNavigateUp(),
  ]);
}
