import { Action } from 'app/reducers';
import { CategoryBooksResponse } from 'app/services/category/requests';
import { Category } from 'app/services/category/reducer.state';

export const LOAD_CATEGORY_LIST_REQUEST = 'LOAD_CATEGORY_LIST_REQUEST';
export const LOAD_CATEGORY_LIST_SUCCESS = 'LOAD_CATEGORY_LIST_SUCCESS';
export const LOAD_CATEGORY_LIST_FAILURE = 'LOAD_CATEGORY_LIST_FAILURE';

export const INITIALIZE_CATEGORY_ID = 'INITIALIZE_CATEGORY_ID';
export const INITIALIZE_CATEGORIES_WHOLE = 'INITIALIZE_CATEGORIES_WHOLE';
export const CACHE_CATEGORY_ID = 'CACHE_CATEGORY_ID';

export const LOAD_CATEGORY_BOOKS_REQUEST = 'LOAD_CATEGORY_BOOKS_REQUEST';
export const LOAD_CATEGORY_BOOKS_SUCCESS = 'LOAD_CATEGORY_BOOKS_SUCCESS';
export const LOAD_CATEGORY_BOOKS_FAILURE = 'LOAD_CATEGORY_BOOKS_FAILURE';

export interface ActionLoadCategoryListRequest
  extends Action<typeof LOAD_CATEGORY_LIST_REQUEST> {}
export interface ActionLoadCategoryListSuccess
  extends Action<typeof LOAD_CATEGORY_LIST_SUCCESS, { categoryList: Category[] }> {}
export interface ActionLoadCategoryListFailure
  extends Action<typeof LOAD_CATEGORY_LIST_FAILURE> {}

export interface ActionInitializeCategoryId
  extends Action<typeof INITIALIZE_CATEGORY_ID> {}
export interface ActionInitializeCategoriesWhole
  extends Action<typeof INITIALIZE_CATEGORIES_WHOLE, { shouldFetchCategoryList: boolean; shouldInitializeCategoryId: boolean; }> {}
export interface ActionCacheCategoryId
  extends Action<typeof CACHE_CATEGORY_ID, { categoryId: number }> {}

export interface ActionLoadCategoryBooksRequest
  extends Action<typeof LOAD_CATEGORY_BOOKS_REQUEST, { categoryId: number; page: number }> {}
export interface ActionLoadCategoryBooksSuccess
  extends Action<
      typeof LOAD_CATEGORY_BOOKS_SUCCESS,
      { categoryId: number; page: number; response: CategoryBooksResponse }
    > {}
export interface ActionLoadCategoryBooksFailure
  extends Action<typeof LOAD_CATEGORY_BOOKS_FAILURE, { categoryId: number; page: number }> {}

export type CategoryBooksActionTypes =
  | ActionLoadCategoryListRequest
  | ActionLoadCategoryListSuccess
  | ActionLoadCategoryListFailure
  | ActionInitializeCategoryId
  | ActionInitializeCategoriesWhole
  | ActionCacheCategoryId
  | ActionLoadCategoryBooksRequest
  | ActionLoadCategoryBooksSuccess
  | ActionLoadCategoryBooksFailure;

export const loadCategoryListRequest = (): ActionLoadCategoryListRequest => (
  { type: LOAD_CATEGORY_LIST_REQUEST }
);

export const loadCategoryListSuccess = (
  categoryList: Category[],
): ActionLoadCategoryListSuccess => {
  return { type: LOAD_CATEGORY_LIST_SUCCESS, payload: { categoryList } };
};

export const loadCategoryListFailure = (): ActionLoadCategoryListFailure => (
  { type: LOAD_CATEGORY_LIST_FAILURE }
);

export const initializeCategoryId = (): ActionInitializeCategoryId => (
  { type: INITIALIZE_CATEGORY_ID }
);

export const initializeCategoriesWhole = (
  shouldFetchCategoryList: boolean,
  shouldInitializeCategoryId: boolean,
): ActionInitializeCategoriesWhole => (
  { type: INITIALIZE_CATEGORIES_WHOLE, payload: { shouldFetchCategoryList, shouldInitializeCategoryId } }
);

export const cacheCategoryId = (categoryId: number): ActionCacheCategoryId => (
  { type: CACHE_CATEGORY_ID, payload: { categoryId } }
);

export const loadCategoryBooksRequest = (
  categoryId: number,
  page: number,
): ActionLoadCategoryBooksRequest => {
  return { type: LOAD_CATEGORY_BOOKS_REQUEST, payload: { categoryId, page } };
};

export const loadCategoryBooksSuccess = (
  categoryId: number,
  page: number,
  response: CategoryBooksResponse,
): ActionLoadCategoryBooksSuccess => {
  return { type: LOAD_CATEGORY_BOOKS_SUCCESS, payload: { categoryId, page, response } };
};

export const loadCategoryBooksFailure = (
): ActionLoadCategoryBooksFailure => {
  return { type: LOAD_CATEGORY_BOOKS_FAILURE };
};
