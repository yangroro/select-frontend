import { updateBooks } from 'app/services/book/actions';
import {
  ActionLoadSelectionRequest,
  LOAD_SELECTION_REQUEST,
  loadSelectionFailure,
  loadSelectionSuccess,
} from 'app/services/selection/actions';
import { requestSelection, SelectionResponse } from 'app/services/selection/requests';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import history from 'app/config/history';
import toast from 'app/utils/toast';

export function* loadSelection({ payload }: ActionLoadSelectionRequest) {
  const { page, selectionId } = payload!;
  try {
    const response: SelectionResponse = yield call(requestSelection, selectionId, page);
    yield put(updateBooks(response.books));
    yield put(loadSelectionSuccess(selectionId, page, response));
  } catch (e) {
    yield put(loadSelectionFailure(selectionId, page));
    if (
      !e.response.config.params ||
      !e.response.config.params.page ||
      page === 1
    ) {
      toast.fail(`${typeof e === 'string' ? e :'없는 페이지입니다.'} 이전 페이지로 돌아갑니다.`);
      window.requestAnimationFrame(history.goBack);
    }
  }
}

export function* watchLoadSelection() {
  yield takeEvery(LOAD_SELECTION_REQUEST, loadSelection);
}

export function* selectionsRootSaga() {
  yield all([watchLoadSelection()]);
}
