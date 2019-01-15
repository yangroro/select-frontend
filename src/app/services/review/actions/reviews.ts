import { Action } from 'app/services/review/types';
import { TextWithLF } from 'app/types';

import { ReviewSortingCriteria, UserFilterType } from '../constants';
import { ReviewSummary } from '../reducer.state';
import {
  RequestReviewsParameters,
  ResponseReview,
  ResponseReviews,
} from '../requests';
import {
  ActionEndEditingReview,
  ActionStartEditingReview,
} from './reviews';

export const GET_REVIEWS_REQUEST = 'GET_REVIEWS_REQUEST';
export const GET_REVIEWS_SUCCESS = 'GET_REVIEWS_SUCCESS';
export const GET_REVIEWS_FAILURE = 'GET_REVIEWS_FAILURE';

export const RESET_REVIEW_PAGES = 'RESET_REVIEW_PAGES';

export const CHANGE_USER_FILTER_TAB = 'CHANGE_USER_FILTER_TAB';
export const CHANGE_SORT_BY = 'CHANGE_SORT_BY';

export const POST_REVIEW_REQUEST = 'POST_REVIEW_REQUEST';
export const POST_REVIEW_SUCCESS = 'POST_REVIEW_SUCCESS';
export const POST_REVIEW_FAILURE = 'POST_REVIEW_FAILURE';

export const DELETE_REVIEW_REQUEST = 'DELETE_REVIEW_REQUEST';
export const DELETE_REVIEW_SUCCESS = 'DELETE_REVIEW_SUCCESS';
export const DELETE_REVIEW_FAILURE = 'DELETE_REVIEW_FAILURE';

export const START_EDITING_REVIEW = 'START_EDITING_REVIEW';
export const END_EDITING_REVIEW = 'END_EDITING_REVIEW';

export interface ActionGetReviewsRequest extends Action<typeof GET_REVIEWS_REQUEST, {
  bookId: number,
  params: RequestReviewsParameters,
}> {}
export interface ActionGetReviewsSuccess extends Action<typeof GET_REVIEWS_SUCCESS, {
  bookId: number,
  params: RequestReviewsParameters,
  response: ResponseReviews,
}> {}
export interface ActionGetReviewsFailure extends Action<typeof GET_REVIEWS_FAILURE, {
  bookId: number,
  params: RequestReviewsParameters,
}> {}

export interface ActionResetReviewPages extends Action<typeof RESET_REVIEW_PAGES, {
  bookId: number,
}> {}

export interface ActionChangeUserFilterTab extends Action<typeof CHANGE_USER_FILTER_TAB, {
  bookId: number,
  userFilterType: UserFilterType,
}> {}
export interface ActionChangeSortBy extends Action<typeof CHANGE_SORT_BY, {
  bookId: number,
  sortBy: ReviewSortingCriteria,
}> {}

export interface ActionPostReviewRequest extends Action<typeof POST_REVIEW_REQUEST, {
  bookId: number,
  content: TextWithLF,
  hasSpoiler: boolean,
}> {}
export interface ActionPostReviewSuccess extends Action<typeof POST_REVIEW_SUCCESS, {
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
}> {}
export interface ActionPostReviewFailure extends Action<typeof POST_REVIEW_FAILURE, {
  bookId: number,
}> {}

export interface ActionDeleteReviewRequest extends Action<typeof DELETE_REVIEW_REQUEST, {
  bookId: number,
}> {}
export interface ActionDeleteReviewSuccess extends Action<typeof DELETE_REVIEW_SUCCESS, {
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
}> {}
export interface ActionDeleteReviewFailure extends Action<typeof DELETE_REVIEW_FAILURE, {
  bookId: number,
}> {}

export interface ActionStartEditingReview extends Action<typeof START_EDITING_REVIEW, {
  bookId: number,
}> {}
export interface ActionEndEditingReview extends Action<typeof END_EDITING_REVIEW, {
  bookId: number,
}> {}

export type ReviewsActionTypes =
  ActionGetReviewsRequest |
  ActionGetReviewsSuccess |
  ActionGetReviewsFailure |
  ActionResetReviewPages |
  ActionChangeUserFilterTab |
  ActionChangeSortBy |
  ActionPostReviewRequest |
  ActionPostReviewSuccess |
  ActionPostReviewFailure |
  ActionDeleteReviewRequest |
  ActionDeleteReviewSuccess |
  ActionDeleteReviewFailure |
  ActionStartEditingReview |
  ActionEndEditingReview;

export const getReviewsRequest = (
  bookId: number,
  params: RequestReviewsParameters,
): ActionGetReviewsRequest => {
  return { type: GET_REVIEWS_REQUEST, payload: { bookId, params } };
};

export const getReviewsSuccess = (
  bookId: number,
  params: RequestReviewsParameters,
  response: ResponseReviews,
): ActionGetReviewsSuccess => {
  return { type: GET_REVIEWS_SUCCESS, payload: { bookId, params, response} };
};

export const getReviewsFailure = (
  bookId: number,
  params: RequestReviewsParameters,
): ActionGetReviewsFailure => {
  return { type: GET_REVIEWS_FAILURE, payload: { bookId, params } };
};

export const resetReviews = (
  bookId: number,
): ActionResetReviewPages => {
  return { type: RESET_REVIEW_PAGES, payload: { bookId } };
};

export const changeUserFilterTab = (
  bookId: number,
  userFilterType: UserFilterType,
): ActionChangeUserFilterTab => {
  return { type: CHANGE_USER_FILTER_TAB, payload: { bookId, userFilterType } };
};

export const changeSortBy = (
  bookId: number,
  sortBy: ReviewSortingCriteria,
): ActionChangeSortBy => {
  return { type: CHANGE_SORT_BY, payload: { bookId, sortBy } };
};

export const postReviewRequest = (
  bookId: number,
  content: TextWithLF,
  hasSpoiler: boolean,
): ActionPostReviewRequest => {
  return { type: POST_REVIEW_REQUEST, payload: { bookId, content, hasSpoiler } };
};

export const postReviewSuccess = (
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
): ActionPostReviewSuccess => {
  return { type: POST_REVIEW_SUCCESS, payload: { bookId, review, reviewSummary } };
};

export const postReviewFailure = (
  bookId: number,
): ActionPostReviewFailure => {
  return { type: POST_REVIEW_FAILURE, payload: { bookId } };
};

export const deleteReviewRequest = (
  bookId: number,
): ActionDeleteReviewRequest => {
  return { type: DELETE_REVIEW_REQUEST, payload: { bookId } };
};

export const deleteReviewSuccess = (
  bookId: number,
  review: ResponseReview,
  reviewSummary: ReviewSummary,
): ActionDeleteReviewSuccess => {
  return { type: DELETE_REVIEW_SUCCESS, payload: { bookId, review, reviewSummary } };
};

export const deleteReviewFailure = (
  bookId: number,
): ActionDeleteReviewFailure => {
  return { type: DELETE_REVIEW_FAILURE, payload: { bookId } };
};

export const startEditingReview = (
  bookId: number,
): ActionStartEditingReview => {
  return { type: START_EDITING_REVIEW, payload: { bookId } };
};

export const endEditingReview = (
  bookId: number,
): ActionEndEditingReview => {
  return { type: END_EDITING_REVIEW, payload: { bookId } };
};
