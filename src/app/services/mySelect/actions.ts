import { BookIdsPair } from './requests';
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
export const RESET_MY_SELECT_PAGE_FETCHED_STATUS = 'RESET_MY_SELECT_PAGE_FETCHED_STATUS';

export interface ActionLoadMySelectRequest
  extends Action<typeof LOAD_MY_SELECT_REQUEST, { page: number }> {}
export interface ActionLoadMySelectSuccess
  extends Action<typeof LOAD_MY_SELECT_SUCCESS, { response: MySelectListResponse, page: number }> {}
export interface ActionLoadMySelectFailure
  extends Action<typeof LOAD_MY_SELECT_FAILURE, { page: number }> {}

export interface ActionDeleteMySelectRequest
  extends Action<typeof DELETE_MY_SELECT_REQUEST, { deleteBookIdPairs: Array<BookIdsPair>, page: number, isEveryBookChecked: boolean, }> {}
export interface ActionDeleteMySelectSuccess
  extends Action<typeof DELETE_MY_SELECT_SUCCESS, { deleteBookIdPairs: Array<BookIdsPair> }> {}
export interface ActionDeleteMySelectFailure
  extends Action<typeof DELETE_MY_SELECT_FAILURE> {}

export interface ActionAddMySelectRequest
  extends Action<typeof ADD_MY_SELECT_REQUEST, { bookId: BookId }> {}
export interface ActionAddMySelectSuccess
  extends Action<typeof ADD_MY_SELECT_SUCCESS, { userRidiSelectResponse: UserRidiSelectBookResponse }> {}
export interface ActionAddMySelectFailure
  extends Action<typeof ADD_MY_SELECT_FAILURE> {}

export interface ActionResetMySelectPageFetchedStatus
  extends Action<typeof RESET_MY_SELECT_PAGE_FETCHED_STATUS, { page: number }> {}


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
  | ActionResetMySelectPageFetchedStatus;

export const loadMySelectRequest = (page: number): ActionLoadMySelectRequest => {
  return { type: LOAD_MY_SELECT_REQUEST, payload: { page } };
};

export const loadMySelectSuccess = (response: MySelectListResponse, page: number): ActionLoadMySelectSuccess => {
  return { type: LOAD_MY_SELECT_SUCCESS, payload: { response, page } };
};

export const loadMySelectFailure = (page: number): ActionLoadMySelectFailure => {
  return { type: LOAD_MY_SELECT_FAILURE, payload: { page } };
};

export const deleteMySelectRequest = (deleteBookIdPairs: Array<BookIdsPair>, page: number, isEveryBookChecked: boolean): ActionDeleteMySelectRequest => {
  return { type: DELETE_MY_SELECT_REQUEST, payload: { deleteBookIdPairs, page, isEveryBookChecked } };
};

export const deleteMySelectSuccess = (deleteBookIdPairs: Array<BookIdsPair>): ActionDeleteMySelectSuccess => {
  return { type: DELETE_MY_SELECT_SUCCESS, payload: { deleteBookIdPairs } };
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

export const resetMySelectPageFetchedStatus = (page: number): ActionResetMySelectPageFetchedStatus => {
  return { type: RESET_MY_SELECT_PAGE_FETCHED_STATUS, payload: { page } };
};
