import { Action } from 'app/reducers';
import { HomeResponse } from 'app/services/home/requests';

export const LOAD_HOME_REQUEST = 'LOAD_HOME_REQUEST';
export const LOAD_HOME_SUCCESS = 'LOAD_HOME_SUCCESS';
export const LOAD_HOME_FAILURE = 'LOAD_HOME_FAILURE';

export interface ActionLoadHomeRequest extends Action<typeof LOAD_HOME_REQUEST> {}
export interface ActionLoadHomeSuccess extends Action<typeof LOAD_HOME_SUCCESS, { response: HomeResponse, fetchedAt: number }> {}
export interface ActionLoadHomeFailure extends Action<typeof LOAD_HOME_FAILURE> {}

export type HomeActionTypes =
  ActionLoadHomeRequest |
  ActionLoadHomeSuccess |
  ActionLoadHomeFailure;

export const loadHomeRequest = (): ActionLoadHomeRequest => {
  return { type: LOAD_HOME_REQUEST };
};

export const loadHomeSuccess = (response: HomeResponse, fetchedAt: number): ActionLoadHomeSuccess => {
  return { type: LOAD_HOME_SUCCESS, payload: { response, fetchedAt } };
};

export const loadHomeFailure = (): ActionLoadHomeFailure => {
  return { type: LOAD_HOME_FAILURE };
};
