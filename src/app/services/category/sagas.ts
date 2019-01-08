import { replace } from 'connected-react-router';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import * as qs from 'qs';

import { updateBooks } from 'app/services/book/actions';
import {
  Category,
  Types,
  Creators,
} from 'app/services/category';
import { CategoryBooksResponse, requestCategoryBooks, requestCategoryList } from 'app/services/category/requests';
import { RidiSelectState } from 'app/store';
import { localStorageManager } from 'app/services/category/utils';
import showMessageForRequestError from "app/utils/toastHelper";
import { callbackAfterFailedFetch } from 'app/utils/request';

export async function loadCategoryList() {
  return await requestCategoryList();
}

export function* watchLoadCategoryListRequest() {
  while (true) {
    yield take(Types.LOAD_CATEGORY_LIST_REQUEST);
    try {
      const categoryList = yield call(loadCategoryList);
      yield put(Creators.loadCategoryListSuccess(categoryList));
    } catch (e) {
      showMessageForRequestError(e);
      const state: RidiSelectState = yield select((s) => s);
      yield put(replace({
        ...state.router.location,
        pathname: '/',
      }));
    }
  }
}

export function* watchInitializeWhole() {
  while (true) {
    const payload: {
      shouldFetchCategoryList: boolean,
      shouldInitializeCategoryId: boolean,
    } = yield take(Types.INITIALIZE_CATEGORIES_WHOLE);
    if (payload.shouldFetchCategoryList ) {
      yield put(Creators.loadCategoryListRequest());
      yield take(Types.LOAD_CATEGORY_LIST_SUCCESS);
    }
    if (payload.shouldInitializeCategoryId) {
      yield put(Creators.initializeCategoryId());
    }
  }
}

export function* watchInitializeCategoryId() {
  while (true) {
    yield take(Types.INITIALIZE_CATEGORY_ID);
    const state: RidiSelectState = yield select((s) => s);
    const idFromLocalStorage = localStorageManager.load().lastVisitedCategoryId;

    const categoryId =
      (state.categories.itemList || [])
        .map((category: Category) => category.id)
        .includes((idFromLocalStorage)) &&
        idFromLocalStorage ||
      state.categories.itemList[0].id;

    const parsedQueryString = qs.parse(state.router.location!.search, { ignoreQueryPrefix: true });

    yield put(replace({
      ...state.router.location,
      search: qs.stringify({
        ...parsedQueryString,
        id: categoryId,
      })
    }));

    yield put(Creators.cacheCategoryId(categoryId));
  }
}

export function* watchCacheCategoryId() {
  while (true) {
    const { categoryId } = yield take(Types.CACHE_CATEGORY_ID);
    localStorageManager.save({ lastVisitedCategoryId: categoryId });
  }
}

export function* loadCategoryBooks(payload: { type: string, categoryId: number, page: number }) {
  const { page, categoryId } = payload;
  try {
    if (Number.isNaN(page)) {
      throw '유효하지 않은 페이지입니다.';
    }
    const response: CategoryBooksResponse = yield call(requestCategoryBooks, categoryId, page);
    yield put(updateBooks(response.books));
    yield put(Creators.loadCategoryBooksSuccess(categoryId, page, response));
  } catch (e) {
    yield put(Creators.loadCategoryBooksFailure(categoryId, page))
    callbackAfterFailedFetch(e, page);
  }
}

export function* watchLoadCategoryBooks() {
  yield takeEvery(Types.LOAD_CATEGORY_BOOKS_REQUEST, loadCategoryBooks);
}

export function* categoryRootSaga() {
  yield all([
    watchLoadCategoryListRequest(),
    watchInitializeCategoryId(),
    watchInitializeWhole(),
    watchCacheCategoryId(),
    watchLoadCategoryBooks(),
  ]);
}
