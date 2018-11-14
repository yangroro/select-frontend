import {
  clearBookOwnership,
  closeMySelectPopup,
  loadBookOwnershipRequest,
  openMySelectPopup,
  updateBooks
} from 'app/services/book/actions';
import {
  ActionAddMySelectRequest,
  ActionDeleteMySelectRequest,
  ActionReplaceMySelectRequest,
  ADD_MY_SELECT_REQUEST,
  addMySelectFailure,
  addMySelectSuccess,
  DELETE_MY_SELECT_REQUEST,
  deleteMySelectFailure,
  deleteMySelectSuccess,
  LOAD_MY_SELECT_REQUEST,
  LOAD_MY_SELECT_SUCCESS,
  loadMySelectFailure,
  loadMySelectRequest,
  loadMySelectSuccess,
  REPLACE_MY_SELECT_REQUEST,
  replaceMySelectSuccess,
} from 'app/services/mySelect/actions';
import {
  MySelectListResponse,
  requestAddMySelect,
  requestDeleteMySelect,
  requestMySelectList,
  UserRidiSelectBookResponse,
} from 'app/services/mySelect/requests';
import toast from 'app/utils/toast';
import { AxiosResponse } from 'axios';
import { all, call, put, select, take } from 'redux-saga/effects';
import { downloadBooksInRidiselect } from 'app/utils/downloadUserBook';
import { RidiSelectState } from 'app/store';
import { Book } from "app/services/book";
import { requestBooks } from "app/services/book/requests";
import { keyBy } from "lodash-es";
import showMessageForRequestError from "app/utils/toastHelper";

export function* watchLoadMySelectList() {
  while (true) {
    yield take(LOAD_MY_SELECT_REQUEST);
    try {
      let response: MySelectListResponse = yield call(requestMySelectList);
      if (response.userRidiSelectBooks.length > 0) {
        const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map(book => parseInt(book.bId)));
        const books_map = keyBy(books, 'id');
        response.userRidiSelectBooks.forEach((book, index) => {
          response.userRidiSelectBooks[index].book = books_map[book.bId]
        });
        yield put(updateBooks(books));
      }
      yield put(loadMySelectSuccess(response));
    } catch (e) {
      yield put(loadMySelectFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* watchDeleteMySelect() {
  while (true) {
    const { payload }: ActionDeleteMySelectRequest = yield take(DELETE_MY_SELECT_REQUEST);
    const { mySelectBookIds } = payload!;
    try {
      const response: AxiosResponse<any> = yield call(requestDeleteMySelect, mySelectBookIds);
      if (response.status !== 200) {
        throw new Error();
      }
      const state: RidiSelectState = yield select((s) => s);
      const bookIds = state.mySelect.books
        .filter((book) => mySelectBookIds.includes(book.mySelectBookId))
        .map((book) => book.id);
      yield put(deleteMySelectSuccess(mySelectBookIds));
      yield put(clearBookOwnership(bookIds));
      if (window.android && window.android.mySelectBookDeleted) {
        window.android.mySelectBookDeleted(JSON.stringify(bookIds));
      }
    } catch (e) {
      yield put(deleteMySelectFailure());
    }
  }
}

export function* watchAddMySelect() {
  while (true) {
    const { payload }: ActionAddMySelectRequest = yield take(ADD_MY_SELECT_REQUEST);
    const { bookId } = payload!;
    try {
      let state: RidiSelectState = yield select((s) => s);
      if (!state.mySelect.isFetched) {
        yield put(loadMySelectRequest());
        yield take(LOAD_MY_SELECT_SUCCESS)
        state = yield select((s) => s);
      }
      if (state.mySelect.books.length === 10) {
        yield put(addMySelectFailure());
        yield put(openMySelectPopup(bookId));
      } else {
        let response: UserRidiSelectBookResponse = yield call(requestAddMySelect, bookId);
        const books = yield call(requestBooks, [parseInt(response.bId)]);
        response.book = books[0];
        yield put(addMySelectSuccess(response));
        yield put(loadBookOwnershipRequest(bookId));
        toast.success('마이 셀렉트에 추가되었습니다.', {
          button: {
            showArrowIcon: true,
            callback: () => {
              downloadBooksInRidiselect([bookId]);
            },
            label: '다운로드',
          },
        });
        if (window.android && window.android.mySelectBookInserted) {
          window.android.mySelectBookInserted(bookId);
        }
      }
    } catch (e) {
      yield put(addMySelectFailure());
      toast.fail('오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
    }
  }
}

export function* watchReplaceMySelect() {
  while (true) {
    const { payload }: ActionReplaceMySelectRequest = yield take(REPLACE_MY_SELECT_REQUEST);
    const { bookId: bookIdToAdd, mySelectBookId } = payload!;
    try {
      yield call(requestDeleteMySelect, [mySelectBookId]);
      let response: UserRidiSelectBookResponse = yield call(requestAddMySelect, bookIdToAdd);
      const books = yield call(requestBooks, [parseInt(response.bId)]);
      response.book = books[0];
      yield put(replaceMySelectSuccess(response, mySelectBookId));

      const state: RidiSelectState = yield select((s) => s);
      const bookIdsToDelete = state.mySelect.books
        .filter((book) => mySelectBookId === book.mySelectBookId)
        .map((book) => book.id);
      yield put(clearBookOwnership(bookIdsToDelete));
      yield put(loadBookOwnershipRequest(bookIdToAdd));
      yield put(closeMySelectPopup(bookIdToAdd));
      toast.success('마이 셀렉트에 추가되었습니다.', {
        button: {
          showArrowIcon: true,
          callback: () => {
            downloadBooksInRidiselect([bookIdToAdd]);
          },
          label: '다운로드',
        },
      });
      if (window.android && window.android.mySelectBookInserted) {
        window.android.mySelectBookDeleted(JSON.stringify(bookIdsToDelete));
        window.android.mySelectBookInserted(bookIdToAdd);
      }
    } catch (e) {
      yield put(addMySelectFailure());
      toast.fail('도서 교체에 실패했습니다. 다시 시도해주세요.');
    }
  }
}

export function* mySelectRootSaga() {
  yield all([watchLoadMySelectList(), watchDeleteMySelect(), watchAddMySelect(), watchReplaceMySelect()]);
}
