import { createAction, createReducer } from 'redux-act';

import env from 'app/config/env';

export const Actions = {
  completeIntroImageLoad: createAction('completeIntroImageLoad'),
  completePublicRouteLoad: createAction('completePublicRouteLoad'),
};

const INITIAL_STATE = {
  ...env,
  introImageLoaded: false,
  publicRouteLoad: false,
};

export type EnvironmentState = typeof INITIAL_STATE;

export const environmentReducer = createReducer<EnvironmentState>({}, INITIAL_STATE);

environmentReducer.on(Actions.completeIntroImageLoad, (state): EnvironmentState => ({
  ...state,
  introImageLoaded: true,
}));

environmentReducer.on(Actions.completePublicRouteLoad, (state): EnvironmentState => ({
  ...state,
  publicRouteLoad: true,
}));
