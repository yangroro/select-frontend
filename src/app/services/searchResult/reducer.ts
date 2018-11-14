import { FetchStatusFlag } from 'app/constants';
import {
  QUERY_KEYWORD_FAILURE,
  QUERY_KEYWORD_REQUEST,
  QUERY_KEYWORD_SUCCESS,
  SearchResultActionTypes,
} from 'app/services/searchResult/actions';
import {
  searchResultInitialState,
  SearchResultState,
} from 'app/services/searchResult/reducer.state';

export const searchResultReducer = (
  state = searchResultInitialState,
  action: SearchResultActionTypes,
): SearchResultState => {
  switch (action.type) {
    case QUERY_KEYWORD_REQUEST: {
      const { page, keyword } = action.payload!;
      return {
        ...state,
        [keyword]: {
          ...state[keyword],
          itemCount: state[keyword] ? state[keyword].itemCount : undefined,
          itemListByPage: {
            ...(state[keyword] && state[keyword].itemListByPage),
            [page]: {
              fetchStatus: FetchStatusFlag.FETCHING,
              itemList: [],
              isFetched: false,
            },
          },
        },
      };
    }
    case QUERY_KEYWORD_SUCCESS: {
      const { keyword, response, page } = action.payload!;
      return {
        ...state,
        [keyword]: {
          ...state[keyword],
          itemListByPage: {
            ...state[keyword].itemListByPage,
            [page]: {
              fetchStatus: FetchStatusFlag.IDLE,
              itemList: response.books.map((book) => ({
                bookId: book.id,
                highlight: book.highlight,
                publisher: book.publisher,
              })),
              isFetched: true,
            },
          },
          itemCount: response.totalCount,
        },
      };
    }
    case QUERY_KEYWORD_FAILURE: {
      const { keyword, page } = action.payload!;
      return {
        ...state,
        [keyword]: {
          ...state[keyword],
          itemListByPage: {
            ...state[keyword].itemListByPage,
            [page]: {
              fetchStatus: FetchStatusFlag.FETCH_ERROR,
              itemList: [],
              isFetched: true,
            },
          },
        },
      };
    }
    default:
      return state;
  }
};
