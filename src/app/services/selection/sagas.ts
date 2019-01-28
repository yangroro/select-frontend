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
    if (selectionId !== 'hotRelease') {
      // hotRelease의 경우 홈 화면에서만 섹션이 노출되고 아직 전체보기 페이지가 없어서 페이지네이션의 개념이 없음....
      // 오픈 전에는 데이터가 없기 때문에 뒤로가기 처리가 되면 안되는 이유로 예외처리.
      callbackAfterFailedFetch(e, page);
    }
  }
}

export function* watchLoadSelection() {
  yield takeEvery(Actions.loadSelectionRequest.getType(), loadSelection);
}

export function* selectionsRootSaga() {
  yield all([watchLoadSelection()]);
}
