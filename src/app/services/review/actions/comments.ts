import { Action } from 'app/services/review/types';
import { TextWithLF } from 'app/types';

import { ResponseComment } from 'app/services/review/requests';

export const SHOW_MORE_COMMENTS = 'SHOW_MORE_COMMENTS';

export const POST_COMMENT_REQUEST = 'POST_COMMENT_REQUEST';
export const POST_COMMENT_SUCCESS = 'POST_COMMENT_SUCCESS';
export const POST_COMMENT_FAILURE = 'POST_COMMENT_FAILURE';

export const DELETE_COMMENT_REQUEST = 'DELETE_COMMENT_REQUEST';
export const DELETE_COMMENT_SUCCESS = 'DELETE_COMMENT_SUCCESS';
export const DELETE_COMMENT_FAILURE = 'DELETE_COMMENT_FAILURE';

export const UPDATE_COMMENT_INPUT = 'UPDATE_COMMENT_INPUT';

export interface ActionShowMoreComments extends Action<typeof SHOW_MORE_COMMENTS, {
  bookId: number,
  reviewId: number,
  page: number,
}> {}

export interface ActionPostCommentRequest extends Action<typeof POST_COMMENT_REQUEST, {
  bookId: number,
  reviewId: number,
  content: TextWithLF,
}> {}
export interface ActionPostCommentSuccess extends Action<typeof POST_COMMENT_SUCCESS, {
  bookId: number,
  reviewId: number,
  comment: ResponseComment,
}> {}
export interface ActionPostCommentFailure extends Action<typeof POST_COMMENT_FAILURE, {
  bookId: number,
  reviewId: number,
}> {}

export interface ActionDeleteCommentRequest extends Action<typeof DELETE_COMMENT_REQUEST, {
  bookId: number,
  reviewId: number,
  commentId: number,
}> {}
export interface ActionDeleteCommentSuccess extends Action<typeof DELETE_COMMENT_SUCCESS, {
  bookId: number,
  reviewId: number,
  commentId: number,
}> {}
export interface ActionDeleteCommentFailure extends Action<typeof DELETE_COMMENT_FAILURE, {
  bookId: number,
  reviewId: number,
  commentId: number,
}> {}

export interface ActionUpdateCommentInput extends Action<typeof UPDATE_COMMENT_INPUT, {
  bookId: number,
  reviewId: number,
  content: TextWithLF,
}> {}

export type CommentsActionTypes =
  ActionShowMoreComments |
  ActionPostCommentRequest |
  ActionPostCommentSuccess |
  ActionPostCommentFailure |
  ActionDeleteCommentRequest |
  ActionDeleteCommentSuccess |
  ActionDeleteCommentFailure |
  ActionUpdateCommentInput;

export const showMoreComments = (
  bookId: number,
  reviewId: number,
  page: number,
): ActionShowMoreComments => {
  return {
    type: SHOW_MORE_COMMENTS,
    payload: { bookId, reviewId, page },
  };
};

export const postCommentRequest = (
  bookId: number,
  reviewId: number,
  content: TextWithLF,
): ActionPostCommentRequest => {
  return {
    type: POST_COMMENT_REQUEST,
    payload: {
      bookId,
      reviewId,
      content,
    },
  };
};

export const postCommentSuccess = (
  bookId: number,
  reviewId: number,
  comment: ResponseComment,
): ActionPostCommentSuccess => {
  return { type: POST_COMMENT_SUCCESS, payload: { bookId, reviewId, comment } };
};

export const postCommentFailure = (
  bookId: number,
  reviewId: number,
): ActionPostCommentFailure => {
  return { type: POST_COMMENT_FAILURE, payload: { bookId, reviewId } };
};

export const deleteCommentRequest = (
  bookId: number,
  reviewId: number,
  commentId: number,
): ActionDeleteCommentRequest => {
  return {
    type: DELETE_COMMENT_REQUEST,
    payload: {
      bookId,
      reviewId,
      commentId,
    },
  };
};

export const deleteCommentSuccess = (
  bookId: number,
  reviewId: number,
  commentId: number,
): ActionDeleteCommentSuccess => {
  return { type: DELETE_COMMENT_SUCCESS, payload: { bookId, reviewId, commentId } };
};

export const deleteCommentFailure = (
  bookId: number,
  reviewId: number,
  commentId: number,
): ActionDeleteCommentFailure => {
  return { type: DELETE_COMMENT_FAILURE, payload: { bookId, reviewId, commentId } };
};

export const updateCommentInput = (
  bookId: number,
  reviewId: number,
  content: TextWithLF,
): ActionUpdateCommentInput => {
  return { type: UPDATE_COMMENT_INPUT, payload: { bookId, reviewId, content } };
};
