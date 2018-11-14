import { Action } from "app/reducers";
import { BookId } from "app/types";

export const TRACK_CLICK = 'TRACK_CLICK';
export const TRACK_IMPRESSION = 'TRACK_IMPRESSION';

export interface DefaultTrackingParams {
  section: string;
  index: number; // index in section
  id: BookId;
}
export type ActionTrackClick = Action<typeof TRACK_CLICK, DefaultTrackingParams>;
export type ActionTrackImpression = Action<typeof TRACK_IMPRESSION, DefaultTrackingParams>;

export type TrackingActionTypes =
  | ActionTrackClick
  | ActionTrackImpression;

export const trackClick = (trackingParams: DefaultTrackingParams): ActionTrackClick => ({
  type: TRACK_CLICK,
  payload: trackingParams,
});

export const trackImpression = (trackingParams: DefaultTrackingParams): ActionTrackImpression => ({
  type: TRACK_IMPRESSION,
  payload: trackingParams
});
