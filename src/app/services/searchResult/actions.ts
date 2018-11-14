import { Action } from 'app/reducers';
import { SearchResultReponse } from 'app/services/searchResult/requests';

export const QUERY_KEYWORD_REQUEST = 'QUERY_KEYWORD_REQUEST';
export const QUERY_KEYWORD_SUCCESS = 'QUERY_KEYWORD_SUCCESS';
export const QUERY_KEYWORD_FAILURE = 'QUERY_KEYWORD_FAILURE';

export interface ActionQueryKeywordRequest
  extends Action<typeof QUERY_KEYWORD_REQUEST, { keyword: string; page: number }> {}
export interface ActionQueryKeywordSuccess
  extends Action<
      typeof QUERY_KEYWORD_SUCCESS,
      { keyword: string; page: number; response: SearchResultReponse }
    > {}
export interface ActionQueryKeywordFailure
  extends Action<typeof QUERY_KEYWORD_FAILURE, { keyword: string; page: number }> {}

export type SearchResultActionTypes =
  | ActionQueryKeywordRequest
  | ActionQueryKeywordSuccess
  | ActionQueryKeywordFailure;

export const queryKeywordRequest = (
  keyword: string,
  page: number,
): ActionQueryKeywordRequest => {
  return { type: QUERY_KEYWORD_REQUEST, payload: { keyword, page } };
};

export const queryKeywordSuccess = (
  keyword: string,
  page: number,
  response: SearchResultReponse,
): ActionQueryKeywordSuccess => {
  return { type: QUERY_KEYWORD_SUCCESS, payload: { keyword, page, response } };
};

export const queryKeywordFailure = (
  keyword: string,
  page: number,
): ActionQueryKeywordFailure => {
  return { type: QUERY_KEYWORD_FAILURE, payload: { keyword, page } };
};
