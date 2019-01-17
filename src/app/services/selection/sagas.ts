import { Actions as BookActions } from 'app/services/book';
import { Actions } from 'app/services/selection';
import { requestSelection, SelectionResponse } from 'app/services/selection/requests';
import { callbackAfterFailedFetch } from 'app/utils/request';
import { all, call, put, takeEvery } from 'redux-saga/effects';

export function* loadSelection({ payload }: ReturnType<typeof Actions.loadSelectionRequest>) {
  const { page, selectionId } = payload!;
  try {
    const response: SelectionResponse = yield call(requestSelection, selectionId, page);
    yield put(BookActions.updateBooks({ books: response.books }));
    if (selectionId === 'hotRelease') {
      yield put(Actions.updateHotRelease({ hotRelease: response }));
    } else {
      yield put(Actions.loadSelectionSuccess({ selectionId, page, response }));
    }
  } catch (e) {
    yield put(Actions.loadSelectionFailure({ selectionId, page }));
    callbackAfterFailedFetch(e, page);
  }
}

export function* watchLoadSelection() {
  yield takeEvery(Actions.loadSelectionRequest.getType(), loadSelection);
}

export function* selectionsRootSaga() {
  yield all([watchLoadSelection()]);
}
