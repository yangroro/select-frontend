import { createReducer, createAction } from 'redux-act';

import { CategoryBooksResponse } from 'app/services/category/requests';
import { DefaultSelectionState } from 'app/services/selection';
import { FetchStatusFlag } from 'app/constants';

export enum Types {
  LOAD_CATEGORY_LIST_REQUEST = 'LOAD_CATEGORY_LIST_REQUEST',
  LOAD_CATEGORY_LIST_SUCCESS = 'LOAD_CATEGORY_LIST_SUCCESS',
  LOAD_CATEGORY_LIST_FAILURE = 'LOAD_CATEGORY_LIST_FAILURE',
  INITIALIZE_CATEGORY_ID = 'INITIALIZE_CATEGORY_ID',
  INITIALIZE_CATEGORIES_WHOLE = 'INITIALIZE_CATEGORIES_WHOLE',
  CACHE_CATEGORY_ID = 'CACHE_CATEGORY_ID',
  LOAD_CATEGORY_BOOKS_REQUEST = 'LOAD_CATEGORY_BOOKS_REQUEST',
  LOAD_CATEGORY_BOOKS_SUCCESS = 'LOAD_CATEGORY_BOOKS_SUCCESS',
  LOAD_CATEGORY_BOOKS_FAILURE = 'LOAD_CATEGORY_BOOKS_FAILURE',
}

export const Actions = {
  loadCategoryListRequest: createAction(Types.LOAD_CATEGORY_LIST_REQUEST),

  loadCategoryListSuccess: createAction<{
    categoryList: Category[],
  }>(Types.LOAD_CATEGORY_LIST_SUCCESS),

  loadCategoryListFailure: createAction(Types.LOAD_CATEGORY_LIST_FAILURE),

  initializeCategoryId: createAction(Types.INITIALIZE_CATEGORY_ID),

  initializeCategoriesWhole: createAction<{
    shouldFetchCategoryList: boolean,
    shouldInitializeCategoryId: boolean,
  }>(Types.INITIALIZE_CATEGORIES_WHOLE),

  cacheCategoryId: createAction<{
    categoryId: number,
  }>(Types.CACHE_CATEGORY_ID),

  loadCategoryBooksRequest: createAction<{
    categoryId: number,
    page: number,
  }>(Types.LOAD_CATEGORY_BOOKS_REQUEST),

  loadCategoryBooksSuccess: createAction<{
    categoryId: number,
    page: number,
    response: CategoryBooksResponse,
  }>(Types.LOAD_CATEGORY_BOOKS_SUCCESS),

  loadCategoryBooksFailure: createAction<{
    categoryId: number,
    page: number,
  }>(Types.LOAD_CATEGORY_BOOKS_FAILURE),
};

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

export const categoryListReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

categoryListReducer.on(Actions.loadCategoryListRequest, state => ({
	...state,
  fetchStatus: FetchStatusFlag.FETCHING,
}));

categoryListReducer.on(Actions.loadCategoryListSuccess, (state, { categoryList }) => ({
  ...state,
  fetchStatus: FetchStatusFlag.IDLE,
  isFetched: true,
  itemList: categoryList,
}));

categoryListReducer.on(Actions.loadCategoryListFailure, state => ({
  ...state,
  fetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

categoryListReducer.on(Actions.cacheCategoryId, (state, { categoryId }) => ({
  ...state,
  lastSelectedCategoryId: categoryId,
}));

export const categoryBooksReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);

categoryBooksReducer.on(Actions.loadCategoryBooksRequest, (state = INITIAL_STATE, { page, categoryId }) => ({
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
}));

categoryBooksReducer.on(Actions.loadCategoryBooksSuccess, (state = INITIAL_STATE, { categoryId, response, page }) => ({
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
}));

categoryBooksReducer.on(Actions.loadCategoryBooksFailure, (state = INITIAL_STATE, { categoryId, page }) => ({
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
}));
