import { all, call, put, take, takeEvery } from 'redux-saga/effects';

import { FetchErrorFlag } from 'app/constants';
import { Actions } from 'app/services/closingReservedBooks';
import { ClosingReservedBooksResponse, requestClosingReservedBooks } from 'app/services/closingReservedBooks/requests';
import toast from 'app/utils/toast';

export function* loadClosingReservedBooks({ payload }: ReturnType<typeof Actions.loadClosingReservedBooksRequest>) {
  const { page, termType } = payload;
  try {
    if (Number.isNaN(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: ClosingReservedBooksResponse = yield call(requestClosingReservedBooks, termType, page);
    yield put(Actions.loadClosingReservedBooksSuccess({ termType, page, response }));
  } catch (error) {
    yield put(Actions.loadClosingReservedBooksFailure({ termType, page, error }));
  }
}

export function* watchLoadClosingReservedBooksRequest() {
  yield takeEvery(Actions.loadClosingReservedBooksRequest.getType(), loadClosingReservedBooks);
}

export function* watchLoadClosingReservedBooksFailure() {
  while (true) {
    const { payload: { termType, page, error } }: ReturnType<typeof Actions.loadClosingReservedBooksFailure> = yield take(Actions.loadClosingReservedBooksFailure.getType());
    if (error === FetchErrorFlag.UNEXPECTED_PAGE_PARAMS || page === 1) {
      toast.failureMessage('없는 페이지입니다. 다시 시도해주세요.');
      return;
    }
    toast.failureMessage();
  }
}

export function* closingReservedBooksRootSaga() {
  yield all([
    watchLoadClosingReservedBooksRequest(),
    watchLoadClosingReservedBooksFailure(),
  ]);
}
