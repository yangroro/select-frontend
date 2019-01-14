import { mapValues } from 'lodash-es';

import toast from 'app/utils/toast';
import history from 'app/config/history';
import { RidiSelectState } from 'app/store';
import { Actions } from 'app/services/book';
import { all, call, fork, put, select, take } from 'redux-saga/effects';
import { BookOwnershipStatus, BookState, LocalStorageStaticBookState, StaticBookState, LegacyStaticBookState } from 'app/services/book/reducer.state';
import { BookDetailResponse, requestBookDetail, requestBookOwnership, BookDetailResponseV1, BookDetailResponseV2 } from 'app/services/book/requests';

const KEY_LOCAL_STORAGE = 'rs.books';
const booksLocalStorageManager = {
  load: (): LocalStorageStaticBookState => {
    const data = localStorage.getItem(KEY_LOCAL_STORAGE);
    if (!data) {
      return {};
    }
    return mapValues(JSON.parse(data), (book: LegacyStaticBookState) => {
      if (book.bookDetail && (<BookDetailResponseV1>book.bookDetail).description) {
        (<BookDetailResponseV2>book.bookDetail).introduction = (<BookDetailResponseV1>book.bookDetail).description;
        delete (<BookDetailResponseV1>book.bookDetail).description;
      }
      return book as StaticBookState;
    });
  },
  save: (state: BookState) => {
    const staticBookState: LocalStorageStaticBookState = Object
      .keys(state)
      .reduce((prev, bookId): LocalStorageStaticBookState => {
        const id = Number(bookId);
        return {
          ...prev,
          [id]: {
            dominantColor: state[id].dominantColor,
            book: state[id].book,
            bookDetail: state[id].bookDetail,
          },
        };
      }, {});
    try {
      localStorage.setItem(KEY_LOCAL_STORAGE, JSON.stringify(staticBookState));
    }  catch(e) {
      localStorage.removeItem(KEY_LOCAL_STORAGE);
    }
  },
};

function* initialSaga() {
  yield put(Actions.initializeBooks({
    staticBookState: booksLocalStorageManager.load()
  }));
}

function* watchActionsToCache() {
  while (true) {
    yield take([
      Actions.updateBooks.getType(),
      Actions.loadBookDetailSuccess.getType(),
      Actions.updateDominantColor.getType(),
    ]);
    const books = yield select((state: RidiSelectState) => state.booksById);
    booksLocalStorageManager.save(books);
  }
}

export function* watchLoadBookDetail() {
  while (true) {
    // Destructuring not working: https://github.com/Microsoft/TypeScript/issues/6784
    const { action } = yield take(Actions.loadBookDetailRequest.getType());
    const bookId = action;

    try {
      const response: BookDetailResponse = yield call(requestBookDetail, bookId);
      if (response.seriesBooks && response.seriesBooks.length > 0) {
        yield put(Actions.updateBooks({
          books: response.seriesBooks,
        }));
      }
      yield put(Actions.loadBookDetailSuccess({
        bookId: response.id,
        bookDetail: response
      }));
      if (String(bookId) !== String(response.id)) {
        history.replace(`/book/${response.id}`);
      }
    } catch (e) {
      if (e.response.status === 404) {
        toast.fail('도서가 존재하지 않습니다.');
        history.replace('/home');
      } else {
        toast.defaultErrorMessage();
      }
      yield put(Actions.loadBookDetailFailure({
        bookId
      }));
    }
  }
}

export function* watchLoadBookOwnership() {
  while (true) {
    const { action } = yield take(Actions.loadBookOwnershipRequest.getType());
    const bookId = action;
    try {
      const response: BookOwnershipStatus  = yield call(requestBookOwnership, bookId);
      yield put(Actions.loadBookOwnershipSuccess({
        bookId,
        ownershipStatus: response,
      }));
    } catch (e) {
      yield put(Actions.loadBookOwnershipFailure({
        bookId
      }));
    }
  }
}

export function* bookRootSaga() {
  yield fork(initialSaga);
  yield all([
    watchLoadBookDetail(),
    watchActionsToCache(),
    watchLoadBookOwnership(),
  ]);
}
