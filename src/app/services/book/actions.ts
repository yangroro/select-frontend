import { Action } from 'app/reducers';
import { Book } from 'app/services/book';
import { BookOwnershipStatus, LocalStorageStaticBookState } from 'app/services/book/reducer.state';
import { BookDetailResponse } from 'app/services/book/requests';
import { RGB } from 'app/services/commonUI';
import { BookId } from 'app/types';

export const INITIALIZE_BOOKS = 'INITIALIZE_BOOKS';
export const UPDATE_BOOKS = 'UPDATE_BOOKS';
export const LOAD_BOOK_DETAIL_REQUEST = 'LOAD_BOOK_DETAIL_REQUEST';
export const LOAD_BOOK_DETAIL_SUCCESS = 'LOAD_BOOK_DETAIL_SUCCESS';
export const LOAD_BOOK_DETAIL_FAILURE = 'LOAD_BOOK_DETAIL_FAILURE';
export const LOAD_BOOK_OWNERSHIP_REQUEST = 'LOAD_BOOK_OWNERSHIP_REQUEST';
export const LOAD_BOOK_OWNERSHIP_SUCCESS = 'LOAD_BOOK_OWNERSHIP_SUCCESS';
export const LOAD_BOOK_OWNERSHIP_FAILURE = 'LOAD_BOOK_OWNERSHIP_FAILURE';
export const CLEAR_BOOK_OWNERSHIP = 'CLEAR_BOOK_OWNERSHIP';
export const UPDATE_DOMINANT_COLOR = 'UPDATE_DOMINANT_COLOR';
export const MY_SELECT_REPLACEMENT_POPUP_OPEN = 'MY_SELECT_REPLACEMENT_POPUP_OPEN';
export const MY_SELECT_REPLACEMENT_POPUP_CLOSE = 'MY_SELECT_REPLACEMENT_POPUP_CLOSE';

export interface ActionInitializeBooks
  extends Action<typeof INITIALIZE_BOOKS, LocalStorageStaticBookState> {}
export interface ActionUpdateBooks extends Action<typeof UPDATE_BOOKS, { books: Book[] }> {}

export interface ActionLoadDetailBookRequest
  extends Action<typeof LOAD_BOOK_DETAIL_REQUEST, { bookId: BookId }> {}
export interface ActionLoadDetailBookSuccess
  extends Action<
      typeof LOAD_BOOK_DETAIL_SUCCESS,
      {
        bookId: BookId;
        bookDetail: BookDetailResponse;
      }
    > {}
export interface ActionLoadDetailBookFailure
  extends Action<typeof LOAD_BOOK_DETAIL_FAILURE, { bookId: BookId }> {}

export interface ActionLoadBookOwnershipRequest
  extends Action<typeof LOAD_BOOK_OWNERSHIP_REQUEST, { bookId: BookId }> {}
export interface ActionLoadBookOwnershipSuccess
  extends Action<
  typeof LOAD_BOOK_OWNERSHIP_SUCCESS,
  {
    bookId: BookId;
    ownershipStatus: BookOwnershipStatus;
  }
  > {}
export interface ActionLoadBookOwnershipFailure
  extends Action<typeof LOAD_BOOK_OWNERSHIP_FAILURE, { bookId: BookId }> {}
export interface ActionClearBookOwnership
  extends Action<typeof CLEAR_BOOK_OWNERSHIP, { bookIds: BookId[] }> {}

export interface ActionUpdateDominantColor
  extends Action<typeof UPDATE_DOMINANT_COLOR, { bookId: BookId; color: RGB }> {}

export interface ActionMySelectReplacementPopupOpen
  extends Action<typeof MY_SELECT_REPLACEMENT_POPUP_OPEN, { bookId: BookId; }> {}
export interface ActionMySelectReplacementPopupClose
  extends Action<typeof MY_SELECT_REPLACEMENT_POPUP_CLOSE, { bookId: BookId; }> {}

export type BookActionTypes =
  | ActionInitializeBooks
  | ActionUpdateBooks
  | ActionLoadDetailBookRequest
  | ActionLoadDetailBookSuccess
  | ActionLoadDetailBookFailure
  | ActionLoadBookOwnershipRequest
  | ActionLoadBookOwnershipSuccess
  | ActionLoadBookOwnershipFailure
  | ActionClearBookOwnership
  | ActionUpdateDominantColor
  | ActionMySelectReplacementPopupOpen
  | ActionMySelectReplacementPopupClose;

export const initializeBooks = (
  staticBookState: LocalStorageStaticBookState,
): ActionInitializeBooks => {
  return { type: INITIALIZE_BOOKS, payload: staticBookState };
};

export const updateBooks = (books: Book[]): ActionUpdateBooks => {
  return { type: UPDATE_BOOKS, payload: { books } };
};

export const loadBookRequest = (bookId: BookId): ActionLoadDetailBookRequest => {
  return { type: LOAD_BOOK_DETAIL_REQUEST, payload: { bookId } };
};

export const loadBookSuccess = (
  bookId: BookId,
  bookDetail: BookDetailResponse,
): ActionLoadDetailBookSuccess => {
  return { type: LOAD_BOOK_DETAIL_SUCCESS, payload: { bookId, bookDetail } };
};

export const loadBookFailure = (bookId: BookId): ActionLoadDetailBookFailure => {
  return { type: LOAD_BOOK_DETAIL_FAILURE, payload: { bookId } };
};

export const loadBookOwnershipRequest = (bookId: BookId): ActionLoadBookOwnershipRequest => {
  return { type: LOAD_BOOK_OWNERSHIP_REQUEST, payload: { bookId } };
};

export const loadBookOwnershipSuccess = (
  bookId: BookId,
  ownershipStatus: BookOwnershipStatus,
): ActionLoadBookOwnershipSuccess => {
  return { type: LOAD_BOOK_OWNERSHIP_SUCCESS, payload: { bookId, ownershipStatus } };
};

export const loadBookOwnershipFailure = (bookId: BookId): ActionLoadBookOwnershipFailure => {
  return { type: LOAD_BOOK_OWNERSHIP_FAILURE, payload: { bookId } };
};

export const clearBookOwnership = (bookIds: BookId[]): ActionClearBookOwnership => {
  return { type: CLEAR_BOOK_OWNERSHIP, payload: { bookIds } };
}

export const updateDominantColor = (bookId: BookId, color: RGB): ActionUpdateDominantColor => {
  return { type: UPDATE_DOMINANT_COLOR, payload: { bookId, color } };
};

export const openMySelectPopup = (bookId: BookId): ActionMySelectReplacementPopupOpen => {
  return { type: MY_SELECT_REPLACEMENT_POPUP_OPEN, payload: { bookId } };
};

export const closeMySelectPopup = (bookId: BookId): ActionMySelectReplacementPopupClose => {
  return { type: MY_SELECT_REPLACEMENT_POPUP_CLOSE, payload: { bookId } };
};
