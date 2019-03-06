import history from 'app/config/history';
import { FetchErrorFlag } from 'app/constants';
import { Actions as BookActions } from 'app/services/book';
import { Book } from 'app/services/book';
import { requestBooks } from 'app/services/book/requests';
import { Actions } from 'app/services/mySelect';
import {
  MySelectListResponse,
  requestAddMySelect,
  requestDeleteMySelect,
  requestMySelectList,
  UserRidiSelectBookResponse,
} from 'app/services/mySelect/requests';
import { RidiSelectState } from 'app/store';
import { downloadBooksInRidiselect, readBooksInRidiselect } from 'app/utils/downloadUserBook';
import { updateQueryStringParam } from 'app/utils/request';
import toast, { TOAST_DEFAULT_ERROR_MESSAGE } from 'app/utils/toast';
import { AxiosResponse } from 'axios';
import { keyBy } from 'lodash-es';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';

export function* loadMySelectList({ payload }: ReturnType<typeof Actions.loadMySelectRequest>) {
  const { page } = payload;
  try {
    if (Number.isNaN(page)) {
      throw FetchErrorFlag.UNEXPECTED_PAGE_PARAMS;
    }
    const response: MySelectListResponse = yield call(requestMySelectList, page);
    if (response.userRidiSelectBooks.length > 0) {
      const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map((book) => parseInt(book.bId, 10)));
      const booksMap = keyBy(books, 'id');
      response.userRidiSelectBooks.forEach((book, index) => {
        response.userRidiSelectBooks[index].book = booksMap[book.bId];
      });
      yield put(BookActions.updateBooks({ books }));
    } else if (response.totalCount < page) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
    }
    yield put(Actions.loadMySelectSuccess({
      response,
      page,
    }));
  } catch (error) {
    yield put(Actions.loadMySelectFailure({ page, error }));
  }
}

export function* watchLoadMySelectList() {
  yield takeEvery(Actions.loadMySelectRequest.getType(), loadMySelectList);
}

export function* watchDeleteMySelect() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.deleteMySelectRequest> = yield take(Actions.deleteMySelectRequest.getType());
    const { deleteBookIdPairs, page, isEveryBookChecked } = payload!;
    const deleteBookIds: number[] = [];
    const deleteMySelectBookIds: number[] = [];

    deleteBookIdPairs.forEach((bookIdPair) => {
      deleteBookIds.push(bookIdPair.bookId);
      deleteMySelectBookIds.push(bookIdPair.mySelectBookId);
    });

    try {
      const response: AxiosResponse<any> = yield call(requestDeleteMySelect, deleteMySelectBookIds);
      if (response.status !== 200) {
        throw new Error();
      }
      if (window.android && window.android.mySelectBookDeleted) {
        window.android.mySelectBookDeleted(JSON.stringify(deleteBookIds));
      }
      if (isEveryBookChecked && page > 1) {
        yield all([
          put(Actions.deleteMySelectSuccess({ deleteBookIdPairs })),
          put(BookActions.clearBookOwnership({ bookIds: deleteBookIds })),
        ]);
        history.replace(`/my-select?page=${page - 1}`);
      } else {
        yield all([
          put(Actions.deleteMySelectSuccess({ deleteBookIdPairs })),
          put(Actions.loadMySelectRequest({ page })),
          put(BookActions.clearBookOwnership({ bookIds: deleteBookIds })),
        ]);
      }
    } catch (e) {
      yield put(Actions.deleteMySelectFailure());
    }
  }
}

export function* watchAddMySelect() {
  while (true) {
    const { payload }: ReturnType<typeof Actions.addMySelectRequest> = yield take(Actions.addMySelectRequest.getType());
    const state: RidiSelectState = yield select((s) => s);
    const { bookId } = payload!;
    try {
      const response: UserRidiSelectBookResponse = yield call(requestAddMySelect, bookId);
      const books = yield call(requestBooks, [parseInt(response.bId, 10)]);
      response.book = books[0];
      yield put(Actions.addMySelectSuccess({ userRidiSelectResponse: response }));
      yield put(BookActions.loadBookOwnershipRequest({ bookId }));
      const toastButton = state.environment.platform.isRidibooks ? {
        callback: () => { readBooksInRidiselect(bookId); },
        label: '읽기',
      } : {
        callback: () => { downloadBooksInRidiselect([bookId]); },
        label: '다운로드',
      };
      toast.success('마이 셀렉트에 추가되었습니다.', {
        button: {
          showArrowIcon: true,
          ...toastButton,
        },
      });
      if (window.android && window.android.mySelectBookInserted) {
        window.android.mySelectBookInserted(bookId);
      }
    } catch (e) {
      yield put(Actions.addMySelectFailure());
      toast.failureMessage('오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
    }
  }
}

export function* watchLoadMySelectFailure() {
  while (true) {
    const { payload: { error, page } }: ReturnType<typeof Actions.loadMySelectFailure> = yield take(Actions.loadMySelectFailure.getType());
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

export function* mySelectRootSaga() {
  yield all([watchLoadMySelectList(), watchDeleteMySelect(), watchAddMySelect()]);
}
