import { updateBooks } from 'app/services/book/actions';
import {
  Types,
  Creators,
} from 'app/services/searchResult';
import { requestSearchResult, SearchResultReponse } from 'app/services/searchResult/requests';
import { all, call, put, takeEvery } from 'redux-saga/effects';


export function* queryKeyword(action: { type: string, keyword: string, page: number }) {
  const { page, keyword } = action;
  let response: SearchResultReponse;
  try {
    response = yield call(requestSearchResult, keyword, page);
    yield put(updateBooks(response.books));
    yield put(Creators.queryKeywordSuccess(keyword, page, response));
  } catch (e) {
    yield put(Creators.queryKeywordFailure(keyword, page));
  }
}

export function* watchQueryKeyword() {
  yield takeEvery(Types.QUERY_KEYWORD_REQUEST, queryKeyword);
}

export function* searchResultRootSaga() {
  yield all([watchQueryKeyword()]);
}
