import { trackingInitialState, TrackingState } from "./reducer.state";
import { TrackingActionTypes } from "./actions";

export const trackingReducer = (
  state = trackingInitialState || {},
  action: TrackingActionTypes,
): TrackingState => {
  return state;
};
