import { Action } from 'app/reducers';
import { MySelectListResponse, UserRidiSelectBookResponse } from 'app/services/mySelect/requests';
import { BookId } from 'app/types';

export const LOAD_MY_SELECT_REQUEST = 'LOAD_MY_SELECT_REQUEST';
export const LOAD_MY_SELECT_SUCCESS = 'LOAD_MY_SELECT_SUCCESS';
export const LOAD_MY_SELECT_FAILURE = 'LOAD_MY_SELECT_FAILURE';
export const DELETE_MY_SELECT_REQUEST = 'DELETE_MY_SELECT_REQUEST';
export const DELETE_MY_SELECT_SUCCESS = 'DELETE_MY_SELECT_SUCCESS';
export const DELETE_MY_SELECT_FAILURE = 'DELETE_MY_SELECT_FAILURE';
export const ADD_MY_SELECT_REQUEST = 'ADD_MY_SELECT_REQUEST';
export const ADD_MY_SELECT_SUCCESS = 'ADD_MY_SELECT_SUCCESS';
export const ADD_MY_SELECT_FAILURE = 'ADD_MY_SELECT_FAILURE';
export const REPLACE_MY_SELECT_REQUEST = 'REPLACE_MY_SELECT_REQUEST';
export const REPLACE_MY_SELECT_SUCCESS = 'REPLACE_MY_SELECT_SUCCESS';
export const REPLACE_MY_SELECT_FAILURE = 'REPLACE_MY_SELECT_FAILURE';

export interface ActionLoadMySelectRequest extends Action<typeof LOAD_MY_SELECT_REQUEST> {}
export interface ActionLoadMySelectSuccess
  extends Action<typeof LOAD_MY_SELECT_SUCCESS, { response: MySelectListResponse }> {}
export interface ActionLoadMySelectFailure extends Action<typeof LOAD_MY_SELECT_FAILURE> {}

export interface ActionDeleteMySelectRequest
  extends Action<typeof DELETE_MY_SELECT_REQUEST, { mySelectBookIds: number[] }> {}
export interface ActionDeleteMySelectSuccess
  extends Action<typeof DELETE_MY_SELECT_SUCCESS, { mySelectBookIds: number[] }> {}
export interface ActionDeleteMySelectFailure extends Action<typeof DELETE_MY_SELECT_FAILURE> {}

export interface ActionAddMySelectRequest
  extends Action<typeof ADD_MY_SELECT_REQUEST, { bookId: BookId }> {}
export interface ActionAddMySelectSuccess
  extends Action<typeof ADD_MY_SELECT_SUCCESS, { userRidiSelectResponse: UserRidiSelectBookResponse }> {}
export interface ActionAddMySelectFailure extends Action<typeof ADD_MY_SELECT_FAILURE> {}

export interface ActionReplaceMySelectRequest
  extends Action<typeof REPLACE_MY_SELECT_REQUEST, { bookId: BookId; mySelectBookId: number }> {}
export interface ActionReplaceMySelectSuccess
  extends Action<typeof REPLACE_MY_SELECT_SUCCESS, { userRidiSelectResponse: UserRidiSelectBookResponse; mySelectBookId: number }> {}
export interface ActionReplaceMySelectFailure
  extends Action<typeof REPLACE_MY_SELECT_FAILURE, { bookId: BookId; mySelectBookId: number }> {}

export type MySelectActionTypes =
  | ActionLoadMySelectRequest
  | ActionLoadMySelectSuccess
  | ActionLoadMySelectFailure
  | ActionDeleteMySelectRequest
  | ActionDeleteMySelectSuccess
  | ActionDeleteMySelectFailure
  | ActionAddMySelectRequest
  | ActionAddMySelectSuccess
  | ActionAddMySelectFailure
  | ActionReplaceMySelectRequest
  | ActionReplaceMySelectSuccess
  | ActionReplaceMySelectFailure;

export const loadMySelectRequest = (): ActionLoadMySelectRequest => {
  return { type: LOAD_MY_SELECT_REQUEST };
};

export const loadMySelectSuccess = (response: MySelectListResponse): ActionLoadMySelectSuccess => {
  return { type: LOAD_MY_SELECT_SUCCESS, payload: { response } };
};

export const loadMySelectFailure = (): ActionLoadMySelectFailure => {
  return { type: LOAD_MY_SELECT_FAILURE };
};

export const deleteMySelectRequest = (mySelectBookIds: number[]): ActionDeleteMySelectRequest => {
  return { type: DELETE_MY_SELECT_REQUEST, payload: { mySelectBookIds } };
};

export const deleteMySelectSuccess = (mySelectBookIds: number[]): ActionDeleteMySelectSuccess => {
  return { type: DELETE_MY_SELECT_SUCCESS, payload: { mySelectBookIds } };
};

export const deleteMySelectFailure = (): ActionDeleteMySelectFailure => {
  return { type: DELETE_MY_SELECT_FAILURE };
};

export const addMySelectRequest = (bookId: BookId): ActionAddMySelectRequest => {
  return { type: ADD_MY_SELECT_REQUEST, payload: { bookId } };
};

export const addMySelectSuccess = (userRidiSelectResponse: UserRidiSelectBookResponse): ActionAddMySelectSuccess => {
  return { type: ADD_MY_SELECT_SUCCESS, payload: { userRidiSelectResponse } };
};

export const addMySelectFailure = (): ActionAddMySelectFailure => {
  return { type: ADD_MY_SELECT_FAILURE };
};

export const replaceMySelectRequest = (
  bookId: BookId,
  mySelectBookId: number,
): ActionReplaceMySelectRequest => {
  return { type: REPLACE_MY_SELECT_REQUEST, payload: { bookId, mySelectBookId } };
};

export const replaceMySelectSuccess = (
  userRidiSelectResponse: UserRidiSelectBookResponse,
  mySelectBookId: number,
): ActionReplaceMySelectSuccess => {
  return { type: REPLACE_MY_SELECT_SUCCESS, payload: { userRidiSelectResponse, mySelectBookId } };
};

export const replaceMySelectFailure = (
  bookId: BookId,
  mySelectBookId: number,
): ActionReplaceMySelectFailure => {
  return { type: REPLACE_MY_SELECT_FAILURE, payload: {bookId, mySelectBookId } };
};
