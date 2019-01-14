import { BookDetailResponse } from 'app/services/book/requests';
import { createAction, createReducer } from 'redux-act';

import { BookId } from 'app/types';
import { RGB } from 'app/services/commonUI';
import {
  LocalStorageStaticBookState,
  Book,
  BookOwnershipStatus,
  INITIAL_BOOK_STATE,
  BookState
} from 'app/services/book/reducer.state';
import { FetchStatusFlag } from 'app/constants';

export * from './reducer.state';
export * from './utils';

export const Actions = {
  initializeBooks: createAction<{
    staticBookState: LocalStorageStaticBookState,
  }>(),
  updateBooks: createAction<{
    books: Book[],
  }>(),
  loadBookDetailRequest: createAction<{
    bookId: BookId,
  }>(),
  loadBookDetailSuccess: createAction<{
    bookId: BookId,
    bookDetail: BookDetailResponse,
  }>(),
  loadBookDetailFailure: createAction<{
    bookId: BookId,
  }>(),
  loadBookOwnershipRequest: createAction<{
    bookId: BookId,
  }>(),
  loadBookOwnershipSuccess: createAction<{
    bookId: BookId,
    ownershipStatus: BookOwnershipStatus,
  }>(),
  loadBookOwnershipFailure: createAction<{
    bookId: BookId,
  }>(),
  clearBookOwnership: createAction<{
    bookIds: BookId[],
  }>(),
  updateDominantColor: createAction<{
    bookId: BookId,
    color: RGB,
  }>(),
};

export const bookReducer = createReducer<typeof INITIAL_BOOK_STATE>({}, INITIAL_BOOK_STATE);

bookReducer.on(Actions.initializeBooks, (state, action) => {
  const staticBookState: LocalStorageStaticBookState = action;
  return {
    ...state,
    ...Object.keys(staticBookState).reduce((prev, bookId): BookState => {
      const id = Number(bookId);
      return {
        ...prev,
        [id]: {
          ...staticBookState[id],
          detailFetchStatus: FetchStatusFlag.IDLE,
          isDetailFetched: false,
          isFetched: false,
        },
      };
    }, {}),
  };
});

bookReducer.on(Actions.updateBooks, (state, action) => {
  const { books = [] } = action;
  const newState: BookState = books.reduce((prev, book) => {
    prev[book.id] = {
      ...state[book.id],
      isFetched: !!state[book.id] ? state[book.id].isFetched : false,
      isDetailFetched: !!state[book.id] ? state[book.id].isDetailFetched : false,
      detailFetchStatus: !!state[book.id] ? state[book.id].detailFetchStatus : FetchStatusFlag.IDLE,
      ownershipFetchStatus: !!state[book.id] ? state[book.id].ownershipFetchStatus : FetchStatusFlag.IDLE,
      book: !!state[book.id] ? { ...state[book.id].book, ...book } : book,
    };
    return prev;
  }, state);
  return newState;
});

bookReducer.on(Actions.loadBookDetailRequest, (state, action) => {
  const { bookId } = action;
  const book = state[bookId];
  return {
    ...state,
    [bookId]: {
      ...state[bookId],
      detailFetchStatus: FetchStatusFlag.FETCHING,
      ownershipFetchStatus: !!state[bookId] ? state[bookId].ownershipFetchStatus : FetchStatusFlag.IDLE,
      isDetailFetched: !!state[bookId] ? state[bookId].isDetailFetched : false,
      isFetched: !!book ? state[bookId].isFetched : false,
      bookDetail: !!book && book.bookDetail ? state[bookId].bookDetail : undefined,
    },
  };
});

bookReducer.on(Actions.loadBookDetailSuccess, (state, action) => {
  const { bookId, bookDetail } = action;
  return {
    ...state,
    [bookId]: {
      ...state[bookId],
      detailFetchStatus: FetchStatusFlag.IDLE,
      isDetailFetched: true,
      bookDetail: {
        ...bookDetail,
      },
    },
  };
});

bookReducer.on(Actions.loadBookDetailFailure, (state, action) => {
  const { bookId } = action;
  return {
    ...state,
    [bookId]: {
      ...state[bookId],
      detailFetchStatus: FetchStatusFlag.FETCH_ERROR,
      isDetailFetched: false,
    },
  };
});

bookReducer.on(Actions.loadBookOwnershipRequest, (state, action) => {
  const { bookId } = action;
  return {
    ...state,
    [bookId]: {
      ...state[bookId],
      ownershipFetchStatus: FetchStatusFlag.FETCHING,
    },
  };
});

bookReducer.on(Actions.loadBookOwnershipSuccess, (state, action) => {
  const { bookId, ownershipStatus } = action;
  return {
    ...state,
    [bookId]: {
      ...state[bookId],
      ownershipFetchStatus: FetchStatusFlag.IDLE,
      ownershipStatus,
    },
  };
});

bookReducer.on(Actions.loadBookOwnershipFailure, (state, action) => {
  const { bookId } = action;
  return {
    ...state,
    [bookId]: {
      ...state[bookId],
      ownershipFetchStatus: FetchStatusFlag.FETCH_ERROR,
    },
  };
});

bookReducer.on(Actions.clearBookOwnership, (state, action) => {
  const { bookIds } = action;
  return bookIds.reduce((newState, bookId) => {
    return {
      ...newState,
      [bookId]: {
        ...newState[bookId],
        ownershipStatus: undefined,
      },
    };
  }, state);
});

bookReducer.on(Actions.updateDominantColor, (state, action) => {
  const { bookId, color } = action;
  return {
    ...state,
    [bookId]: {
      ...state[bookId],
      dominantColor: color,
    },
  };
});