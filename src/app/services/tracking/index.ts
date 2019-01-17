import { createAction, createReducer } from 'redux-act';

import { BookId } from 'app/types';
export interface DefaultTrackingParams {
  section: string;
  index: number; // index in section
  id: BookId;
}

export const Actions = {
  trackClick: createAction<{
    trackingParams: DefaultTrackingParams,
  }>('trackClick'),

  trackImpression: createAction<{
    trackingParams: DefaultTrackingParams,
  }>('trackImpression'),
};

export const INITIAL_STATE = {};

export const trackingReducer = createReducer<typeof INITIAL_STATE>({}, INITIAL_STATE);
