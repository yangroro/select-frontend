import { FetchErrorFlag } from 'app/constants';
import { Actions as BookActions } from 'app/services/book';
import { Actions } from 'app/services/collection';
import { CollectionResponse, requestCollection } from 'app/services/collection/requests';
import toast, { TOAST_DEFAULT_ERROR_MESSAGE } from 'app/utils/toast';
import { all, call, put, take, takeEvery } from 'redux-saga/effects';

export function* loadCollection({ payload }: ReturnType<typeof Actions.loadCollectionRequest>) {
  const { page, collectionId } = payload!;
  try {
    if (Number.isNaN(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: CollectionResponse = yield call(requestCollection, collectionId, page);
    yield put(BookActions.updateBooks({ books: response.books }));
    if (collectionId === 'hotRelease') {
      yield put(Actions.updateHotRelease({ hotRelease: response }));
    } else {
      yield put(Actions.loadCollectionSuccess({ collectionId, page, response }));
    }
  } catch (error) {
    yield put(Actions.loadCollectionFailure({ collectionId, page, error }));
  }
}

export function* watchLoadCollection() {
  yield takeEvery(Actions.loadCollectionRequest.getType(), loadCollection);
}

export function* watchCollectionFailure() {
  while (true) {
    const { payload: { collectionId, error } }: ReturnType<typeof Actions.loadCollectionFailure> = yield take(Actions.loadCollectionFailure.getType());
    if (collectionId === 'hotRelease') {
      // hotRelease의 경우 홈 화면에서만 섹션이 노출되고 아직 전체보기 페이지가 없어서 페이지네이션의 개념이 없음....
      // 오픈 전에는 데이터가 없기 때문에 뒤로가기 처리가 되면 안되는 이유로 예외처리.
      return;
    }
    let message = TOAST_DEFAULT_ERROR_MESSAGE;
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS) {
      message = '유효하지 않은 페이지입니다.';
    } else if (
      (error.response && error.response.config) &&
      (!error.response.config.params || !error.response.config.params.page || page === 1)
    ) {
      message = '없는 페이지입니다. 다시 시도해주세요.';
    }
    toast.failureMessage(message);
  }
}

export function* collectionsRootSaga() {
  yield all([watchLoadCollection()]);
}
