import { createAction, createReducer } from 'redux-act';

import env from 'app/config/env';

export const Actions = {
  completeIntroImageLoad: createAction('completeIntroImageLoad'),
  completeBookDetailLoad: createAction('completeBookDetailLoad'),
};

const INITIAL_STATE = {
  ...env,
  introImageLoaded: false,
  bookDetailLoaded: false,
};

export type EnvironmentState = typeof INITIAL_STATE;

export const environmentReducer = createReducer<EnvironmentState>({}, INITIAL_STATE);

environmentReducer.on(Actions.completeIntroImageLoad, (state): EnvironmentState => ({
  ...state,
  introImageLoaded: true,
}));

environmentReducer.on(Actions.completeBookDetailLoad, (state): EnvironmentState => ({
  ...state,
  bookDetailLoaded: true,
}));
