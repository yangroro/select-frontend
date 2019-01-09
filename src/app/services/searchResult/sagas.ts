import { updateBooks } from 'app/services/book/actions';
import { Actions } from 'app/services/searchResult';
import { requestSearchResult, SearchResultReponse } from 'app/services/searchResult/requests';
import { all, call, put, takeEvery } from 'redux-saga/effects';


export function* queryKeyword({ payload }: { type: string, payload: { keyword: string, page: number } }) {
  const { page, keyword } = payload;
  let response: SearchResultReponse;
  try {
    response = yield call(requestSearchResult, keyword, page);
    yield put(updateBooks(response.books));
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
