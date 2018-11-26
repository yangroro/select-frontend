import {
  ActionLoadBookOwnershipRequest,
  ActionLoadDetailBookRequest,
  initializeBooks,
  LOAD_BOOK_DETAIL_REQUEST,
  LOAD_BOOK_DETAIL_SUCCESS,
  LOAD_BOOK_OWNERSHIP_REQUEST,
  loadBookFailure,
  loadBookOwnershipFailure,
  loadBookOwnershipSuccess,
  loadBookSuccess,
  UPDATE_BOOKS,
  UPDATE_DOMINANT_COLOR,
  updateBooks,
} from 'app/services/book/actions';
import { BookOwnershipStatus, BookState, LocalStorageStaticBookState, StaticBookState, LegacyStaticBookState } from 'app/services/book/reducer.state';
import { BookDetailResponse, requestBookDetail, requestBookOwnership, BookDetailResponseV1, BookDetailResponseV2 } from 'app/services/book/requests';
import { RidiSelectState } from 'app/store';
import { all, call, fork, put, select, take } from 'redux-saga/effects';
import { setDisableScroll } from 'app/utils/utils';
import history from 'app/config/history';
import { mapValues } from 'lodash-es';
import toast from 'app/utils/toast';

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
  yield put(initializeBooks(booksLocalStorageManager.load()));
}

function* watchActionsToCache() {
  while (true) {
    yield take([UPDATE_BOOKS, LOAD_BOOK_DETAIL_SUCCESS, UPDATE_DOMINANT_COLOR]);
    const books = yield select((state: RidiSelectState) => state.booksById);
    booksLocalStorageManager.save(books);
  }
}

export function* watchLoadBookDetail() {
  while (true) {
    // Destructuring not working: https://github.com/Microsoft/TypeScript/issues/6784
    const { payload }: ActionLoadDetailBookRequest = yield take(LOAD_BOOK_DETAIL_REQUEST);
    const bookId = payload!.bookId;

    try {
      const response: BookDetailResponse = yield call(requestBookDetail, bookId);
      if (response.seriesBooks && response.seriesBooks.length > 0) {
        yield put(updateBooks(response.seriesBooks));
      }
      yield put(loadBookSuccess(response.id, response))
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
      yield put(loadBookFailure(bookId));
    }
  }
}

export function* watchLoadBookOwnership() {
  while (true) {
    const { payload }: ActionLoadBookOwnershipRequest = yield take(LOAD_BOOK_OWNERSHIP_REQUEST);
    const bookId = payload!.bookId;
    try {
      const response: BookOwnershipStatus  = yield call(requestBookOwnership, bookId);
      yield put(loadBookOwnershipSuccess(bookId, response));
    } catch (e) {
      yield put(loadBookOwnershipFailure(bookId));
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
