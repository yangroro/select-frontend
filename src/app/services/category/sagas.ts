import { replace } from 'connected-react-router';
import { all, call, put, select, take, takeEvery } from 'redux-saga/effects';
import * as qs from 'qs';

import { updateBooks } from 'app/services/book/actions';
import {
  ActionInitializeCategoriesWhole,
  ActionLoadCategoryBooksRequest,
  CACHE_CATEGORY_ID,
  cacheCategoryId,
  INITIALIZE_CATEGORIES_WHOLE,
  INITIALIZE_CATEGORY_ID,
  initializeCategoryId,
  LOAD_CATEGORY_BOOKS_REQUEST,
  LOAD_CATEGORY_LIST_REQUEST,
  LOAD_CATEGORY_LIST_SUCCESS,
  loadCategoryBooksSuccess,
  loadCategoryListRequest,
  loadCategoryListSuccess,
  loadCategoryBooksFailure,
} from 'app/services/category/actions';
import { CategoryBooksResponse, requestCategoryBooks, requestCategoryList } from 'app/services/category/requests';
import { RidiSelectState } from 'app/store';
import { localStorageManager } from 'app/services/category/utils';
import { Category } from 'app/services/category/reducer.state';
import showMessageForRequestError from "app/utils/toastHelper";
import { callbackAfterFailedFetch } from 'app/utils/request';

export async function loadCategoryList() {
  return await requestCategoryList();
}

export function* watchLoadCategoryListRequest() {
  while (true) {
    yield take(LOAD_CATEGORY_LIST_REQUEST);
    try {
      const categoryList = yield call(loadCategoryList);
      yield put(loadCategoryListSuccess(categoryList));
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

export function* watchInitializeCategoryId() {
  while (true) {
    yield take(INITIALIZE_CATEGORY_ID);
    const state: RidiSelectState = yield select((s) => s);
    const idFromLocalStorage = localStorageManager.load().lastVisitedCategoryId;

    const categoryId =
      state.categories.itemList
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

    yield put(cacheCategoryId(categoryId));
  }
}

export function* watchInitializeWhole() {
  while (true) {
    const { payload }: ActionInitializeCategoriesWhole = yield take(INITIALIZE_CATEGORIES_WHOLE);
    if (payload!.shouldFetchCategoryList ) {
      yield put(loadCategoryListRequest());
      yield take(LOAD_CATEGORY_LIST_SUCCESS);
    }
    if (payload!.shouldInitializeCategoryId) {
      yield put(initializeCategoryId());
    }
  }
}

export function* watchCacheCategoryId() {
  while (true) {
    const { payload } = yield take(CACHE_CATEGORY_ID);
    localStorageManager.save({ lastVisitedCategoryId: payload.categoryId });
  }
}

export function* loadCategoryBooks({ payload }: ActionLoadCategoryBooksRequest) {
  const { page, categoryId } = payload!;
  try {
    if (Number.isNaN(page)) {
      throw '유효하지 않은 페이지입니다.';
    }
    const response: CategoryBooksResponse = yield call(requestCategoryBooks, categoryId, page);
    yield put(updateBooks(response.books));
    yield put(loadCategoryBooksSuccess(categoryId, page, response));
  } catch (e) {
    yield put(loadCategoryBooksFailure(categoryId, page))
    callbackAfterFailedFetch(e, page);
  }
}

export function* watchLoadCategoryBooks() {
  yield takeEvery(LOAD_CATEGORY_BOOKS_REQUEST, loadCategoryBooks);
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
