import { updateBooks } from 'app/services/book/actions';
import {
  ActionLoadSelectionRequest,
  LOAD_SELECTION_REQUEST,
  loadSelectionFailure,
  loadSelectionSuccess,
} from 'app/services/selection/actions';
import { requestSelection, SelectionResponse } from 'app/services/selection/requests';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { callbackAfterFailedFetch } from 'app/utils/request';

export function* loadSelection({ payload }: ActionLoadSelectionRequest) {
  const { page, selectionId } = payload!;
  try {
    const response: SelectionResponse = yield call(requestSelection, selectionId, page);
    yield put(updateBooks(response.books));
    yield put(loadSelectionSuccess(selectionId, page, response));
  } catch (e) {
    yield put(loadSelectionFailure(selectionId, page));
    callbackAfterFailedFetch(e, page);
  }
}

export function* watchLoadSelection() {
  yield takeEvery(LOAD_SELECTION_REQUEST, loadSelection);
}

export function* selectionsRootSaga() {
  yield all([watchLoadSelection()]);
}
