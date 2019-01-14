import { ActionLoadMySelectRequest, loadMySelectRequest } from './actions';
import {
  Actions as BookActions
} from 'app/services/book';
import {
  ActionAddMySelectRequest,
  ActionDeleteMySelectRequest,
  ADD_MY_SELECT_REQUEST,
  addMySelectFailure,
  addMySelectSuccess,
  DELETE_MY_SELECT_REQUEST,
  deleteMySelectFailure,
  deleteMySelectSuccess,
  LOAD_MY_SELECT_REQUEST,
  loadMySelectFailure,
  loadMySelectSuccess,
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
import { all, call, put, take, select, takeEvery } from 'redux-saga/effects';
import { downloadBooksInRidiselect, readBooksInRidiselect } from 'app/utils/downloadUserBook';
import { RidiSelectState } from 'app/store';
import { Book } from "app/services/book";
import { requestBooks } from "app/services/book/requests";
import { keyBy } from "lodash-es";
import history from 'app/config/history';
import { updateQueryStringParam, callbackAfterFailedFetch } from 'app/utils/request';

export function* loadMySelectList({ payload }: ActionLoadMySelectRequest) {
  const { page } = payload!;
  try {
    let response: MySelectListResponse = yield call(requestMySelectList, page);
    if (response.userRidiSelectBooks.length > 0) {
      const books: Book[] = yield call(requestBooks, response.userRidiSelectBooks.map(book => parseInt(book.bId)));
      const books_map = keyBy(books, 'id');
      response.userRidiSelectBooks.forEach((book, index) => {
        response.userRidiSelectBooks[index].book = books_map[book.bId]
      });
      yield put(BookActions.updateBooks({ books }));
    } else if (response.totalCount < page) {
      history.replace(`?${updateQueryStringParam('page', 1)}`);
    }
    yield put(loadMySelectSuccess(response, page));
  } catch (e) {
    yield put(loadMySelectFailure(page));
    callbackAfterFailedFetch(e, page);
  }
}

export function* watchLoadMySelectList() {
  yield takeEvery(LOAD_MY_SELECT_REQUEST, loadMySelectList)
}

export function* watchDeleteMySelect() {
  while (true) {
    const { payload }: ActionDeleteMySelectRequest = yield take(DELETE_MY_SELECT_REQUEST);
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
          put(deleteMySelectSuccess(deleteBookIdPairs)),
          put(BookActions.clearBookOwnership({ bookIds: deleteBookIds })),
        ]);
        history.replace(`/my-select?page=${page - 1}`);
      } else {
        yield all([
          put(deleteMySelectSuccess(deleteBookIdPairs)),
          put(loadMySelectRequest(page)),
          put(BookActions.clearBookOwnership({ bookIds: deleteBookIds })),
        ]);
      }
    } catch (e) {
      yield put(deleteMySelectFailure());
    }
  }
}

export function* watchAddMySelect() {
  while (true) {
    const { payload }: ActionAddMySelectRequest = yield take(ADD_MY_SELECT_REQUEST);
    const state: RidiSelectState = yield select((s) => s);
    const { bookId } = payload!;
    try {
      let response: UserRidiSelectBookResponse = yield call(requestAddMySelect, bookId);
      const books = yield call(requestBooks, [parseInt(response.bId)]);
      response.book = books[0];
      yield put(addMySelectSuccess(response));
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
      yield put(addMySelectFailure());
      toast.fail('오류가 발생했습니다. 잠시 후에 다시 시도해주세요.');
    }
  }
}

export function* mySelectRootSaga() {
  yield all([watchLoadMySelectList(), watchDeleteMySelect(), watchAddMySelect()]);
}
