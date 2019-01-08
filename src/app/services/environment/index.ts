import { createTypes, createReducer, createActions } from 'reduxsauce';

import env from "app/config/env";

const TYPE = createTypes(`
  INITIALIZE_ENVIRONMENT
`);

export const INITIAL_STATE = env;

export const Reducer = createReducer(INITIAL_STATE, {
  [TYPE.INITIALIZE_ENVIRONMENT]: (state = INITIAL_STATE) => ({
    ...state,
  }),
});

export const { Types, Creators } = createActions({
  initializeEnvironment: null,
})
