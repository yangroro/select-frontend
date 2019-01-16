import { createAction, createReducer } from 'redux-act';

import { Book } from 'app/services/book';
import { BookId, Paginated } from 'app/types';
import { FetchStatusFlag } from 'app/constants';
import { UserRidiSelectBookResponse, MySelectListResponse, BookIdsPair } from 'app/services/mySelect/requests';

export const Actions = {
  loadMySelectRequest: createAction<{
    page: number
  }>('loadMySelectRequest'),
  loadMySelectSuccess: createAction<{
    response: MySelectListResponse,
    page: number
  }>('loadMySelectSuccess'),
  loadMySelectFailure: createAction<{
    page: number
  }>('loadMySelectFailure'),
  deleteMySelectRequest: createAction<{
    page: number,
    deleteBookIdPairs: Array<BookIdsPair>,
    isEveryBookChecked: boolean,
  }>('deleteMySelectRequest'),
  deleteMySelectSuccess: createAction<{
    deleteBookIdPairs: Array<BookIdsPair>
  }>('deleteMySelectSuccess'),
  deleteMySelectFailure: createAction('deleteMySelectFailure'),
  addMySelectRequest: createAction<{
    bookId: BookId
  }>('addMySelectRequest'),
  addMySelectSuccess: createAction<{
    userRidiSelectResponse: UserRidiSelectBookResponse
  }>('addMySelectSuccess'),
  addMySelectFailure: createAction('addMySelectFailure'),
  resetMySelectPageFetchedStatus: createAction<{
    page: number
  }>('resetMySelectPageFetchedStatus'),
};


export interface MySelectBook extends Book {
  mySelectBookId: number;
  startDate: string;
  endDate: string;
}

export interface PaginatedMySelectBooks extends Paginated<MySelectBook> {
  size: number;
}

export interface MySelectState {
  deletionFetchStatus: FetchStatusFlag;
  additionFetchStatus: FetchStatusFlag;
  replacementFetchStatus: FetchStatusFlag;
  mySelectBooks: PaginatedMySelectBooks;
}

export const INITIAL_MYSELECT_STATE: MySelectState = {
  deletionFetchStatus: FetchStatusFlag.IDLE,
  additionFetchStatus: FetchStatusFlag.IDLE,
  replacementFetchStatus: FetchStatusFlag.IDLE,
  mySelectBooks: {
    itemListByPage: {},
    size: 0,
  },
};

export const userRidiSelectBookToMySelectBook = (userRidiSelectbook: UserRidiSelectBookResponse): MySelectBook => {
  return {
    ...userRidiSelectbook.book,
    startDate: userRidiSelectbook.startDate,
    endDate: userRidiSelectbook.endDate,
    mySelectBookId: userRidiSelectbook.id,
  };
};

export const mySelectReducer = createReducer<MySelectState>({}, INITIAL_MYSELECT_STATE);

mySelectReducer.on(Actions.loadMySelectRequest, (state, { page }) => ({
  ...state,
  mySelectBooks: {
    ...state.mySelectBooks,
    itemListByPage: {
      ...state.mySelectBooks.itemListByPage,
      [page]: {
        ...state.mySelectBooks.itemListByPage[page],
        fetchStatus: FetchStatusFlag.FETCHING,
        isFetched: false,
      }
    }
  },
}));

mySelectReducer.on(Actions.loadMySelectSuccess, (state, { response, page }) => ({
  ...state,
  mySelectBooks: {
    itemCount: response.totalCount,
    size: response.size,
    itemListByPage: {
      ...state.mySelectBooks.itemListByPage,
      [page]: {
        fetchStatus: FetchStatusFlag.IDLE,
        itemList: response.userRidiSelectBooks.map(userRidiSelectBookToMySelectBook),
        isFetched: true,
      }
    }
  },
}));

mySelectReducer.on(Actions.loadMySelectFailure, (state, { page }) => ({
  ...state,
  mySelectBooks: {
    ...state.mySelectBooks,
    itemListByPage: {
      ...state.mySelectBooks.itemListByPage,
      [page]: {
        ...state.mySelectBooks.itemListByPage[page],
        fetchStatus: FetchStatusFlag.FETCH_ERROR,
      }
    }
  },
}));

mySelectReducer.on(Actions.deleteMySelectRequest, (state) => ({
  ...state,
  deletionFetchStatus: FetchStatusFlag.FETCHING,
}));

mySelectReducer.on(Actions.deleteMySelectSuccess, (state) => ({
  ...state,
  deletionFetchStatus: FetchStatusFlag.IDLE,
}));

mySelectReducer.on(Actions.deleteMySelectFailure, (state) => ({
  ...state,
  deletionFetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

mySelectReducer.on(Actions.addMySelectRequest, (state) => ({
  ...state,
  additionFetchStatus: FetchStatusFlag.FETCHING,
}));

mySelectReducer.on(Actions.addMySelectSuccess, (state) => ({
  ...state,
  additionFetchStatus: FetchStatusFlag.IDLE,
}));

mySelectReducer.on(Actions.addMySelectFailure, (state) => ({
  ...state,
  additionFetchStatus: FetchStatusFlag.FETCH_ERROR,
}));

mySelectReducer.on(Actions.resetMySelectPageFetchedStatus, (state, { page }) => ({
  ...state,
  mySelectBooks: {
    ...state.mySelectBooks,
    itemListByPage: {
      ...state.mySelectBooks.itemListByPage,
      [page]: {
        ...state.mySelectBooks.itemListByPage[page],
        isFetched: false,
      }
    }
  }
}));