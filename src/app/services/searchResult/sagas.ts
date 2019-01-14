import { Actions as BookActions } from 'app/services/book';
import { Actions } from 'app/services/searchResult';
import { requestSearchResult, SearchResultReponse } from 'app/services/searchResult/requests';
import { all, call, put, takeEvery } from 'redux-saga/effects';


export function* queryKeyword({ payload }: ReturnType<typeof Actions.queryKeywordRequest>) {
  const { page, keyword } = payload;
  let response: SearchResultReponse;
  try {
    response = yield call(requestSearchResult, keyword, page);
    yield put(BookActions.updateBooks({ books: response.books }));
    yield put(Actions.queryKeywordSuccess({ keyword, page, response }));
  } catch (e) {
    yield put(Actions.queryKeywordFailure({ keyword, page }));
  }
}

export function* watchQueryKeyword() {
  yield takeEvery(Actions.queryKeywordRequest.getType(), queryKeyword);
}

export function* searchResultRootSaga() {
  yield all([watchQueryKeyword()]);
}
