import { createAction, createReducer } from 'redux-act';

import env from 'app/config/env';

export const Actions = {
  completeIntroImageLoad: createAction('completeIntroImageLoad'),
};

const INITIAL_STATE = {
  ...env,
  introImageLoaded: false,
};

export type EnvironmentState = typeof INITIAL_STATE;

export const environmentReducer = createReducer<EnvironmentState>({}, INITIAL_STATE);

environmentReducer.on(Actions.completeIntroImageLoad, (state): EnvironmentState => ({
  ...state,
  introImageLoaded: true,
}));
