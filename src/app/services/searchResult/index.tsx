import { createReducer, createTypes, createActions } from 'reduxsauce';

import { FetchStatusFlag } from 'app/constants';
import { BookId, Paginated } from 'app/types';
import { Book } from 'app/services/book';
import { SearchResultReponse } from 'app/services/searchResult/requests';

export interface SearchResultHighlight {
  title?: string;
  subTitle?: string;
  author?: string;
  translator?: string;
  publisher?: string;
}

export interface SearchResultItem {
  bookId: BookId;
  highlight: SearchResultHighlight;
  publisher: {
    name: string;
  }
}

export interface SearchResultBook extends Book {
  highlight: SearchResultHighlight;
  publisher: {
    name: string;
  }
}

export interface KeywordSearchResult extends Paginated<SearchResultItem> {}


const TYPE = createTypes(`
  QUERY_KEYWORD_REQUEST
  QUERY_KEYWORD_SUCCESS
  QUERY_KEYWORD_FAILURE
`)

export interface SearchResultState {
  [keyword: string]: KeywordSearchResult;
}

export const INITIAL_STATE: SearchResultState = {};

export const Reducer = createReducer(INITIAL_STATE, {
  [TYPE.QUERY_KEYWORD_REQUEST]: (state, action) => {
    const { page, keyword } = action;
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
  },
  [TYPE.QUERY_KEYWORD_SUCCESS]: (state, action) => {
    const { keyword, response, page } = action;
    return {
      ...state,
      [keyword]: {
        ...state[keyword],
        itemListByPage: {
          ...state[keyword].itemListByPage,
          [page]: {
            fetchStatus: FetchStatusFlag.IDLE,
            itemList: response.books.map((book: SearchResultBook) => ({
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
  },
  [TYPE.QUERY_KEYWORD_FAILURE]: (state, action) => {
    const { keyword, page } = action;
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
  },
});

export const { Types, Creators } = createActions({
  queryKeywordRequest: ['keyword', 'page'],
  queryKeywordSuccess: (keyword: string, page: number, response: SearchResultReponse) => ({
    type: TYPE.QUERY_KEYWORD_SUCCESS,
    keyword,
    page,
    response
  }),
  queryKeywordFailure: ['keyword', 'page']
});