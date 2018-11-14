import { FetchStatusFlag } from 'app/constants';
import { bookInitialState, BookState, BookStateItem } from 'app/services/book';
import {
  BookActionTypes,
  INITIALIZE_BOOKS,
  LOAD_BOOK_DETAIL_FAILURE,
  LOAD_BOOK_DETAIL_REQUEST,
  LOAD_BOOK_DETAIL_SUCCESS,
  LOAD_BOOK_OWNERSHIP_FAILURE,
  LOAD_BOOK_OWNERSHIP_REQUEST,
  LOAD_BOOK_OWNERSHIP_SUCCESS,
  UPDATE_BOOKS,
  UPDATE_DOMINANT_COLOR,
  MY_SELECT_REPLACEMENT_POPUP_OPEN,
  MY_SELECT_REPLACEMENT_POPUP_CLOSE,
  CLEAR_BOOK_OWNERSHIP,
} from 'app/services/book/actions';
import { LocalStorageStaticBookState } from 'app/services/book/reducer.state';

export const bookReducer = (state = bookInitialState, action: BookActionTypes): BookState => {
  switch (action.type) {
    case UPDATE_BOOKS: {
      const { books = [] } = action.payload!;
      const newState: BookState = books.reduce((prev, book) => {
        prev[book.id] = {
          ...state[book.id],
          isFetched: !!state[book.id] ? state[book.id].isFetched : false,
          isDetailFetched: !!state[book.id] ? state[book.id].isDetailFetched : false,
          isMySelectReplacementPopupOpen: !!state[book.id] ? state[book.id].isMySelectReplacementPopupOpen : false,
          detailFetchStatus: !!state[book.id] ? state[book.id].detailFetchStatus : FetchStatusFlag.IDLE,
          ownershipFetchStatus: !!state[book.id] ? state[book.id].ownershipFetchStatus : FetchStatusFlag.IDLE,
          book: !!state[book.id] ? { ...state[book.id].book, ...book } : book,
        };
        return prev;
      }, state);
      return newState;
    }
    case LOAD_BOOK_DETAIL_REQUEST: {
      const { bookId } = action.payload!;
      const book = state[bookId];
      return {
        ...state,
        [bookId]: {
          ...state[bookId],
          detailFetchStatus: FetchStatusFlag.FETCHING,
          ownershipFetchStatus: !!state[bookId] ? state[bookId].ownershipFetchStatus : FetchStatusFlag.IDLE,
          isMySelectReplacementPopupOpen: !!state[bookId] ? state[bookId].isMySelectReplacementPopupOpen : false,
          isDetailFetched: !!state[bookId] ? state[bookId].isDetailFetched : false,
          isFetched: !!book ? state[bookId].isFetched : false,
          bookDetail: !!book && book.bookDetail ? state[bookId].bookDetail : undefined,
        },
      };
    }
    case LOAD_BOOK_DETAIL_SUCCESS: {
      const { bookId, bookDetail } = action.payload!;
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
    }
    case LOAD_BOOK_DETAIL_FAILURE: {
      const { bookId } = action.payload!;
      return {
        ...state,
        [bookId]: {
          ...state[bookId],
          detailFetchStatus: FetchStatusFlag.FETCH_ERROR,
          isDetailFetched: false,
        },
      };
    }
    case LOAD_BOOK_OWNERSHIP_REQUEST: {
      const { bookId } = action.payload!;
      return {
        ...state,
        [bookId]: {
          ...state[bookId],
          ownershipFetchStatus: FetchStatusFlag.FETCHING,
        },
      };
    }
    case LOAD_BOOK_OWNERSHIP_SUCCESS: {
      const { bookId, ownershipStatus } = action.payload!;
      return {
        ...state,
        [bookId]: {
          ...state[bookId],
          ownershipFetchStatus: FetchStatusFlag.IDLE,
          ownershipStatus,
        },
      };
    }
    case LOAD_BOOK_OWNERSHIP_FAILURE: {
      const { bookId } = action.payload!;
      return {
        ...state,
        [bookId]: {
          ...state[bookId],
          ownershipFetchStatus: FetchStatusFlag.FETCH_ERROR,
        },
      };
    }
    case CLEAR_BOOK_OWNERSHIP: {
      const { bookIds } = action.payload!;
      return bookIds.reduce((newState, bookId) => {
        return {
          ...newState,
          [bookId]: {
            ...newState[bookId],
            ownershipStatus: undefined,
          },
        };
      }, state);
    }
    case UPDATE_DOMINANT_COLOR: {
      const { bookId, color } = action.payload!;
      return {
        ...state,
        [bookId]: {
          ...state[bookId],
          dominantColor: color,
        },
      };
    }
    case INITIALIZE_BOOKS: {
      const staticBookState: LocalStorageStaticBookState = action.payload!;
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
              isMySelectReplacementPopupOpen: false,
            },
          };
        }, {}),
      };
    }
    case MY_SELECT_REPLACEMENT_POPUP_OPEN: {
      const { bookId } = action.payload!;
      return {
        ...state,
        [bookId]: {
          ...state[bookId],
          isMySelectReplacementPopupOpen: true,
        },
      };
    }
    case MY_SELECT_REPLACEMENT_POPUP_CLOSE: {
      const { bookId } = action.payload!;
      return {
        ...state,
        [bookId]: {
          ...state[bookId],
          isMySelectReplacementPopupOpen: false,
        },
      };
    }
    default:
      return state;
  }
};
