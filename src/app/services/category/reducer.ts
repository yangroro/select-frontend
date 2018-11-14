import { FetchStatusFlag } from 'app/constants';
import { categoryBooksInitialState } from 'app/services/category';
import {
  CategoryBooksActionTypes,
  LOAD_CATEGORY_BOOKS_FAILURE,
  LOAD_CATEGORY_BOOKS_REQUEST,
  LOAD_CATEGORY_BOOKS_SUCCESS,
  LOAD_CATEGORY_LIST_REQUEST,
  LOAD_CATEGORY_LIST_FAILURE,
  LOAD_CATEGORY_LIST_SUCCESS,
  CACHE_CATEGORY_ID,
} from 'app/services/category/actions';
import { CategoryBooksState, categoryListInitialState, CategoryListState } from 'app/services/category/reducer.state';

export const categoryListReducer = (
  state = categoryListInitialState,
  action: CategoryBooksActionTypes,
): CategoryListState => {
  switch (action.type) {
    case LOAD_CATEGORY_LIST_REQUEST: {
      return {
        ...state,
        fetchStatus: FetchStatusFlag.FETCHING,
      };
    }
    case LOAD_CATEGORY_LIST_SUCCESS: {
      return {
        ...state,
        fetchStatus: FetchStatusFlag.IDLE,
        isFetched: true,
        itemList: action.payload!.categoryList,
      }
    }
    case LOAD_CATEGORY_LIST_FAILURE: {
      return {
        ...state,
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
      };
    }
    case CACHE_CATEGORY_ID: {
      return {
        ...state,
        lastSelectedCategoryId: action.payload!.categoryId,
      };
    }
    default:
      return state;
  }
}

export const categoryBooksReducer = (
  state = categoryBooksInitialState,
  action: CategoryBooksActionTypes,
): CategoryBooksState => {
  switch (action.type) {
    case LOAD_CATEGORY_BOOKS_REQUEST: {
      const { page, categoryId } = action.payload!;
      return {
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
      };
    }
    case LOAD_CATEGORY_BOOKS_SUCCESS: {
      const { categoryId, response, page } = action.payload!;
      return {
        ...state,
        [categoryId]: {
          ...state[categoryId],
          itemListByPage: {
            ...state[categoryId].itemListByPage,
            [page]: {
              fetchStatus: FetchStatusFlag.IDLE,
              itemList: response.books.map((book) => book.id),
              isFetched: true,
            },
          },
          name: response.category.name,
          itemCount: response.totalCount,
        },
      };
    }
    case LOAD_CATEGORY_BOOKS_FAILURE: {
      const { categoryId, page } = action.payload!;
      return {
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
      };
    }
    default:
      return state;
  }
};
