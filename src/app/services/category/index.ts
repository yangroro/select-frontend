import { createTypes, createReducer, createActions } from 'reduxsauce';

import { CategoryBooksResponse } from 'app/services/category/requests';
import { DefaultSelectionState } from 'app/services/selection';
import { FetchStatusFlag } from 'app/constants';

const TYPE = createTypes(`
  LOAD_CATEGORY_LIST_REQUEST
  LOAD_CATEGORY_LIST_SUCCESS
  LOAD_CATEGORY_LIST_FAILURE
  INITIALIZE_CATEGORY_ID
  CACHE_CATEGORY_ID
  LOAD_CATEGORY_BOOKS_REQUEST
  LOAD_CATEGORY_BOOKS_SUCCESS
  LOAD_CATEGORY_BOOKS_FAILURE
`);

export interface Category {
  id: number;
  name: string;
}

export type CategoryListState = {
  lastSelectedCategoryId?: number;
  itemList: Category[];
  fetchStatus: FetchStatusFlag;
  isFetched: boolean;
};

export interface CategoryBooksState {
  [categoryId: number]: CategoryCollectionState;
}

export const categoryListInitialState: CategoryListState = {
  lastSelectedCategoryId: undefined,
  itemList: [],
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: false,
};

export interface CategoryCollectionState extends DefaultSelectionState {
  name: string;
}

export const INITIAL_STATE: CategoryBooksState = {

};

export const categoryListReducer = createReducer(INITIAL_STATE, {
  [TYPE.LOAD_CATEGORY_LIST_REQUEST]: (state = INITIAL_STATE) => ({
    ...state,
    fetchStatus: FetchStatusFlag.FETCHING,
  }),
  [TYPE.LOAD_CATEGORY_LIST_SUCCESS]: (state = INITIAL_STATE, action) => ({
    ...state,
    fetchStatus: FetchStatusFlag.IDLE,
    isFetched: true,
    itemList: action.categoryList,
  }),
  [TYPE.LOAD_CATEGORY_LIST_FAILURE]: (state = INITIAL_STATE) => ({
    ...state,
    fetchStatus: FetchStatusFlag.FETCH_ERROR,
  }),
  [TYPE.CACHE_CATEGORY_ID]: (state = INITIAL_STATE, action) => ({
    ...state,
    lastSelectedCategoryId: action.categoryId,
  }),
});

export const categoryBooksReducer = createReducer(INITIAL_STATE, {
  [TYPE.LOAD_CATEGORY_BOOKS_REQUEST]: (state = INITIAL_STATE, { page, categoryId }) => ({
    ...state,
    [categoryId]: {
      ...state[categoryId],
      id: categoryId,
      itemCount: 0,
      itemListByPage: {
        ...(state[categoryId] && state[categoryId].itemListByPage),
        [page]: {
          fetchStatus: FetchStatusFlag.FETCHING,
          itemList: [],
          isFetched: false,
        },
      },
    },
  }),
  [TYPE.LOAD_CATEGORY_BOOKS_SUCCESS]: (state = INITIAL_STATE, { categoryId, response, page }) => ({
    ...state,
    [categoryId]: {
      ...state[categoryId],
      itemListByPage: {
        ...state[categoryId].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.IDLE,
          itemList: response.books.map((book: any) => book.id),
          isFetched: true,
        },
      },
      name: response.category.name,
      itemCount: response.totalCount,
    },
  }),
  [TYPE.LOAD_CATEGORY_BOOKS_FAILURE]: (state = INITIAL_STATE, { categoryId, page }) => ({
    ...state,
    [categoryId]: {
      ...state[categoryId],
      itemListByPage: {
        ...state[categoryId].itemListByPage,
        [page]: {
          fetchStatus: FetchStatusFlag.FETCH_ERROR,
          itemList: [],
          isFetched: false,
        },
      },
    },
  }),
});

export const { Types, Creators } = createActions({
  loadCategoryListRequest: null,
  loadCategoryListSuccess: ['categoryList'],
  loadCategoryListFailure: null,
  initializeCategoryId: null,
  initializeCategoriesWhole: (
    shouldFetchCategoryList: boolean,
    shouldInitializeCategoryId: boolean,
  ) => ({ shouldFetchCategoryList, shouldInitializeCategoryId }),
  cacheCategoryId: ['categoryId'],
  loadCategoryBooksRequest: (
    categoryId: number,
    page: number,
  ) => ({ categoryId, page }),
  loadCategoryBooksSuccess: (
    categoryId: number,
    page: number,
    response: CategoryBooksResponse,
  ) => ({ categoryId, page, response }),
  loadCategoryBooksFailure: (
    categoryId: number,
    page: number,
  ) => ({ categoryId, page }),
});
