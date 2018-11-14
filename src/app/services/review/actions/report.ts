import { Action } from 'app/reducers';

export const POST_REVIEW_REPORT_SUCCESS = 'POST_REVIEW_REPORT_SUCCESS';

export interface ActionPostReviewReportSuccess extends Action<typeof POST_REVIEW_REPORT_SUCCESS, {
  bookId: number,
  reviewId: number,
}> {}

export type ReviewReportActionTypes = ActionPostReviewReportSuccess;

export const postReviewReportSuccess = (
  bookId: number,
  reviewId: number,
): ActionPostReviewReportSuccess => {
  return { type: POST_REVIEW_REPORT_SUCCESS, payload: { bookId, reviewId } };
};
