import { createTypes, createReducer } from 'reduxsauce';

import env from "app/config/env";

export const Types = createTypes(`
  INITIALIZE_ENVIRONMENT
`);

export const INITIAL_STATE = env;

export const HANDLERS = {
  [Types.INITIALIZE_ENVIRONMENT]: (state = INITIAL_STATE) => ({
    ...state,
  }),
}

export default createReducer(INITIAL_STATE, HANDLERS)
