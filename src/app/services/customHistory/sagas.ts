import { RidiSelectState } from 'app/store';
import { LOCATION_CHANGE, go } from 'react-router-redux';
import { all, select, take, put, call } from 'redux-saga/effects';
import { NAVIGATE_UP, syncHistoryStack, SYNC_HISTORY_STACK } from 'app/services/customHistory/actions';
import { findUpperPathDiff, historyStackSessionStorageHelper } from './historyStack.helpers';

export function* watchLocationChange() {
  while (true) {
    yield take(LOCATION_CHANGE);
    const state: RidiSelectState = yield select((s) => s);
    if (state.customHistory.historyStack.length === 0 && window.history.length > 0) {
      yield put(syncHistoryStack(
        state.router.location!,
        historyStackSessionStorageHelper.getStack()
      ));
    } else {
      yield put(syncHistoryStack(state.router.location!));
    }
  }
}

export function* watchSyncHistoryStack() {
  while (true) {
    yield take(SYNC_HISTORY_STACK);
    const state: RidiSelectState = yield select((s) => s);
    yield call(historyStackSessionStorageHelper.saveStack, state.customHistory.historyStack);
  }
}

export function* watchNavigateUp(){
  while (true) {
    yield take(NAVIGATE_UP);
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
