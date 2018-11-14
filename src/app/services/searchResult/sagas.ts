import { updateBooks } from 'app/services/book/actions';
import {
  ActionQueryKeywordRequest,
  QUERY_KEYWORD_REQUEST,
  queryKeywordFailure,
  queryKeywordSuccess,
} from 'app/services/searchResult/actions';
import { requestSearchResult, SearchResultReponse } from 'app/services/searchResult/requests';
import { all, call, put, takeEvery } from 'redux-saga/effects';


export function* queryKeyword({ payload }: ActionQueryKeywordRequest) {
  const { page, keyword } = payload!;
  let response: SearchResultReponse;
  try {
    response = yield call(requestSearchResult, keyword, page);
    yield put(updateBooks(response.books));
    yield put(queryKeywordSuccess(keyword, page, response));
  } catch (e) {
    yield put(queryKeywordFailure(keyword, page));
  }
}

export function* watchQueryKeyword() {
  yield takeEvery(QUERY_KEYWORD_REQUEST, queryKeyword);
}

export function* searchResultRootSaga() {
  yield all([watchQueryKeyword()]);
}
