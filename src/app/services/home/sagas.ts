import { Book } from 'app/services/book';
import { updateBooks } from 'app/services/book/actions';
import { LOAD_HOME_REQUEST, loadHomeFailure, loadHomeSuccess } from 'app/services/home/actions';
import { HomeResponse, requestHome } from 'app/services/home/requests';
import { updateSelections } from 'app/services/selection/actions';
import { SelectionResponse } from 'app/services/selection/requests';
import { all, call, put, take } from 'redux-saga/effects';
import showMessageForRequestError from "app/utils/toastHelper";

export function* watchLoadHome() {
  while (true) {
    yield take(LOAD_HOME_REQUEST);
    try {
      const response: HomeResponse = yield call(requestHome);
      // This array might have duplicated book item
      const books = response.selections.reduce((concatedBooks: Book[], section) => {
        return concatedBooks.concat(section.books);
      }, []);
      yield put(updateBooks(books));
      const selections = response.selections.map((section): SelectionResponse => {
        return {
          type: section.type,
          selectionId: section.selectionId,
          title: section.title,
          books: section.books,
          totalCount: 0, // TODO: Ask @minQ
        };
      });
      yield put(updateSelections(selections));
      yield put(loadHomeSuccess(response, Date.now()));
    } catch (e) {
      yield put(loadHomeFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* homeRootSaga() {
  yield all([
    watchLoadHome(),
  ]);
}
