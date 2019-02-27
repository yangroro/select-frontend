import { Book } from 'app/services/book';
import { Actions as BookActions } from 'app/services/book';
import { Actions as CollectionActions } from 'app/services/collection';
import { CollectionResponse } from 'app/services/collection/requests';
import { Actions } from 'app/services/home';
import { HomeResponse, requestHome } from 'app/services/home/requests';
import showMessageForRequestError from 'app/utils/toastHelper';
import { all, call, put, take } from 'redux-saga/effects';

export function* watchLoadHome() {
  while (true) {
    yield take(Actions.loadHomeRequest.getType());
    try {
      const response: HomeResponse = yield call(requestHome);
      // This array might have duplicated book item
      const books = response.collections.reduce((concatedBooks: Book[], section) => {
        return concatedBooks.concat(section.books);
      }, []);
      yield put(BookActions.updateBooks({ books }));
      const collections = response.collections.map((section): CollectionResponse => {
        return {
          type: section.type,
          collectionId: section.collectionId,
          title: section.title,
          books: section.books,
          totalCount: 0, // TODO: Ask @minQ
        };
      });
      yield put(CollectionActions.updateCollections({ collections }));
      yield put(Actions.loadHomeSuccess({
        response,
        fetchedAt: Date.now(),
      }));
    } catch (e) {
      yield put(Actions.loadHomeFailure());
      showMessageForRequestError(e);
    }
  }
}

export function* homeRootSaga() {
  yield all([
    watchLoadHome(),
  ]);
}
