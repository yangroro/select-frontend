import { Action } from 'app/reducers';

export const POST_REVIEW_LIKE_REQUEST = 'POST_REVIEW_LIKE_REQUEST';
export const POST_REVIEW_LIKE_SUCCESS = 'POST_REVIEW_LIKE_SUCCESS';
export const POST_REVIEW_LIKE_FAILURE = 'POST_REVIEW_LIKE_FAILURE';

export const DELETE_REVIEW_LIKE_REQUEST = 'DELETE_REVIEW_LIKE_REQUEST';
export const DELETE_REVIEW_LIKE_SUCCESS = 'DELETE_REVIEW_LIKE_SUCCESS';
export const DELETE_REVIEW_LIKE_FAILURE = 'DELETE_REVIEW_LIKE_FAILURE';

export interface ReviewLikeActionParams {
  bookId: number;
  reviewId: number;
}

export interface ActionPostReviewLikeRequest extends Action<
  typeof POST_REVIEW_LIKE_REQUEST,
  ReviewLikeActionParams
> {}
export interface ActionPostReviewLikeSuccess extends Action<
  typeof POST_REVIEW_LIKE_SUCCESS,
  ReviewLikeActionParams
> {}
export interface ActionPostReviewLikeFailure extends Action<
  typeof POST_REVIEW_LIKE_FAILURE,
  ReviewLikeActionParams
> {}

export interface ActionDeleteReviewLikeRequest extends Action<
  typeof DELETE_REVIEW_LIKE_REQUEST,
  ReviewLikeActionParams
> {}
export interface ActionDeleteReviewLikeSuccess extends Action<
  typeof DELETE_REVIEW_LIKE_SUCCESS,
  ReviewLikeActionParams
> {}
export interface ActionDeleteReviewLikeFailure extends Action<
  typeof DELETE_REVIEW_LIKE_FAILURE,
  ReviewLikeActionParams
> {}

export type ReviewLikeActionTypes =
  ActionPostReviewLikeRequest |
  ActionPostReviewLikeSuccess |
  ActionPostReviewLikeFailure |
  ActionDeleteReviewLikeRequest |
  ActionDeleteReviewLikeSuccess |
  ActionDeleteReviewLikeFailure;

export const postReviewLikeRequest = (
  bookId: number,
  reviewId: number,
): ActionPostReviewLikeRequest => {
  return { type: POST_REVIEW_LIKE_REQUEST, payload: { bookId, reviewId } };
};

export const postReviewLikeSuccess = (
  bookId: number,
  reviewId: number,
): ActionPostReviewLikeSuccess => {
  return { type: POST_REVIEW_LIKE_SUCCESS, payload: { bookId, reviewId } };
};

export const postReviewLikeFailure = (
  bookId: number,
  reviewId: number,
): ActionPostReviewLikeFailure => {
  return { type: POST_REVIEW_LIKE_FAILURE, payload: { bookId, reviewId } };
};

export const deleteReviewLikeRequest = (
  bookId: number,
  reviewId: number,
): ActionDeleteReviewLikeRequest => {
  return { type: DELETE_REVIEW_LIKE_REQUEST, payload: { bookId, reviewId } };
};

export const deleteReviewLikeSuccess = (
  bookId: number,
  reviewId: number,
): ActionDeleteReviewLikeSuccess => {
  return { type: DELETE_REVIEW_LIKE_SUCCESS, payload: { bookId, reviewId } };
};

export const deleteReviewLikeFailure = (
  bookId: number,
  reviewId: number,
): ActionDeleteReviewLikeFailure => {
  return { type: DELETE_REVIEW_LIKE_FAILURE, payload: { bookId, reviewId } };
};
